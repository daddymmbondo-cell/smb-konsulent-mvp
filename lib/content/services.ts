// Sentral konfigurasjon for tjenestesidene. Endre innhold her — det oppdaterer
// automatisk både oversiktssiden og hver enkelt tjenesteside.

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  targetAudience: string;
  problem: string;
  included: string[];
  deliverable: string;
  timeframe: string;
};

export const services: Service[] = [
  {
    slug: "lonnsomhetsanalyse",
    title: "Lønnsomhetsanalyse",
    shortDescription: "Få tydelig oversikt over hvor pengene faktisk blir av.",
    targetAudience: "Butikker, dagligvarebutikker og serveringssteder som mangler oversikt over egen lønnsomhet.",
    problem: "Mange virksomheter vet hva de omsetter for, men ikke hvor lønnsomheten faktisk forsvinner.",
    included: [
      "Gjennomgang av omsetning, varekostnad og faste kostnader",
      "Beregning av bruttofortjeneste, kostnadsandeler og estimert driftsresultat",
      "Identifisering av de 2–3 områdene med størst forbedringspotensial",
    ],
    deliverable: "En kort, forståelig rapport med konkrete, prioriterte anbefalinger.",
    timeframe: "1–2 uker",
  },
  {
    slug: "bemanning-og-driftsforbedring",
    title: "Bemanning og driftsforbedring",
    shortDescription: "Bedre bemanningsplanlegging tilpasset faktiske salgstopper.",
    targetAudience: "Virksomheter med varierende kundetrafikk gjennom dagen eller uken.",
    problem: "Feil bemanning i forhold til faktisk pågang gir unødvendig høye kostnader eller dårlig service.",
    included: [
      "Analyse av timeforbruk mot salg per time",
      "Forslag til justert bemanningsplan",
      "Enkle rutiner for løpende oppfølging",
    ],
    deliverable: "En praktisk bemanningsplan og en enkel oppfølgingsmal.",
    timeframe: "2–3 uker",
  },
  {
    slug: "svinn-og-kostnadskontroll",
    title: "Svinn- og kostnadskontroll",
    shortDescription: "Reduser svinn og unødvendige kostnader med bedre rutiner.",
    targetAudience: "Butikker og serveringssteder med ferskvarer eller høyt vareomløp.",
    problem: "Svinn og unødvendige kostnader spiser rett av bunnlinjen, ofte uten at det er tydelig hvor.",
    included: [
      "Kartlegging av vareflyt og holdbarhetsstyring",
      "Gjennomgang av registreringsrutiner for svinn",
      "Forslag til konkrete rutineendringer",
    ],
    deliverable: "En oversikt over svinnkilder og en tiltaksplan.",
    timeframe: "2–4 uker",
  },
  {
    slug: "lederutvikling",
    title: "Lederutvikling",
    shortDescription: "Styrk lederstruktur, møterytme og medarbeideroppfølging.",
    targetAudience: "Virksomheter med ledere eller avdelingsledere som ønsker bedre struktur.",
    problem: "Uten fast lederstruktur blir oppfølging av mål og medarbeidere tilfeldig.",
    included: [
      "Gjennomgang av dagens ledelsesrutiner",
      "Forslag til fast møtestruktur og målstyring",
      "Enkel mal for medarbeideroppfølging",
    ],
    deliverable: "En konkret lederstruktur tilpasset virksomhetens størrelse.",
    timeframe: "2–3 uker",
  },
  {
    slug: "ki-og-automatisering",
    title: "KI og automatisering for SMB",
    shortDescription: "Praktisk kartlegging av hvor automatisering faktisk gir gevinst.",
    targetAudience: "Virksomheter med manuelle, tidkrevende rutiner.",
    problem: "Manuelle rutiner tar tid og øker risikoen for feil, men det er ikke alltid tydelig hvor man bør starte.",
    included: [
      "Kartlegging av dagens manuelle rutiner",
      "Vurdering av hvilke som egner seg for enkel digitalisering",
      "Forslag til praktiske første steg — ingen store, dyre systemer",
    ],
    deliverable: "En prioritert liste over automatiseringsmuligheter.",
    timeframe: "1–2 uker for kartlegging",
  },
  {
    slug: "interimleder-og-prosjektledelse",
    title: "Interimleder og prosjektledelse",
    shortDescription: "Midlertidig lederstøtte i en krevende periode eller et konkret prosjekt.",
    targetAudience: "Virksomheter i omstilling, uten leder, eller med et konkret forbedringsprosjekt.",
    problem: "Noen ganger trengs det operativ lederstøtte i en periode, ikke bare rådgivning.",
    included: [
      "Operativ tilstedeværelse i den avtalte perioden",
      "Løpende oppfølging av mål og fremdrift",
      "Overlevering og kompetanseoverføring ved avslutning",
    ],
    deliverable: "Avtales konkret basert på behov og omfang.",
    timeframe: "Avtales individuelt",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
