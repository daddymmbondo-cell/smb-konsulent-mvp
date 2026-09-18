// Klient mot Enhetsregisterets åpne data (data.brreg.no).
// Dette er et offentlig, gratis og lovlig tilgjengelig register — det krever ingen
// API-nøkkel eller autentisering. Se: https://data.brreg.no/enhetsregisteret/api/dokumentasjon
//
// VIKTIG: Dette gir kun grunnlagsdata for å FORESLÅ kundeemner (navn, org.nr.,
// bransje, kommune, antall ansatte). Det gir IKKE kontaktinfo eller samtykke til
// markedsføring — det må skaffes separat, og all utsendelse skal godkjennes manuelt
// av en administrator (se lib/leads/email-draft.ts og prosjektreglene i CLAUDE.md).

const BRREG_BASE_URL = "https://data.brreg.no/enhetsregisteret/api/enheter";

export type BrregSearchParams = {
  naeringskode?: string; // f.eks. "47.11" (dagligvare), "56.10" (servering)
  kommunenummer?: string;
  fraAntallAnsatte?: number;
  tilAntallAnsatte?: number;
  size?: number; // maks treff, default 20
};

export type BrregEnhet = {
  organisasjonsnummer: string;
  navn: string;
  naeringskode1?: { kode: string; beskrivelse: string };
  antallAnsatte?: number;
  forretningsadresse?: { kommune?: string; poststed?: string };
  hjemmeside?: string;
};

type BrregResponse = {
  _embedded?: { enheter: BrregEnhet[] };
  page?: { totalElements: number };
};

export class BrregApiError extends Error {}

export async function searchEnheter(params: BrregSearchParams): Promise<{
  enheter: BrregEnhet[];
  totalElements: number;
}> {
  const query = new URLSearchParams();
  if (params.naeringskode) query.set("naeringskode", params.naeringskode);
  if (params.kommunenummer) query.set("kommunenummer", params.kommunenummer);
  if (params.fraAntallAnsatte != null) query.set("fraAntallAnsatte", String(params.fraAntallAnsatte));
  if (params.tilAntallAnsatte != null) query.set("tilAntallAnsatte", String(params.tilAntallAnsatte));
  query.set("size", String(params.size ?? 20));
  // Kun aktive, registrerte enheter — ikke konkurs/avviklet
  query.set("konkurs", "false");
  query.set("underAvvikling", "false");

  const url = `${BRREG_BASE_URL}?${query.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (err) {
    throw new BrregApiError(
      `Kunne ikke nå Brønnøysundregisterets API. Sjekk nettverkstilgang til data.brreg.no. (${err instanceof Error ? err.message : "ukjent feil"})`
    );
  }

  if (!res.ok) {
    throw new BrregApiError(`Brønnøysundregisteret svarte med status ${res.status}.`);
  }

  const data = (await res.json()) as BrregResponse;
  return {
    enheter: data._embedded?.enheter ?? [],
    totalElements: data.page?.totalElements ?? 0,
  };
}

// Vanlige næringskoder for målgruppen (butikk, dagligvare, kiosk, servering)
export const RELEVANT_NACE_CODES = [
  { code: "47.11", label: "Butikkhandel med bredt vareutvalg med hovedvekt på nærings- og nytelsesmidler" },
  { code: "47.19", label: "Annen butikkhandel med bredt vareutvalg" },
  { code: "47.29", label: "Butikkhandel med annet nærings- og nytelsesmiddel" },
  { code: "56.10", label: "Restaurantvirksomhet" },
  { code: "56.30", label: "Drift av barer" },
  { code: "47.30", label: "Detaljhandel med drivstoff til motorvogner (bensinstasjon/kiosk)" },
];
