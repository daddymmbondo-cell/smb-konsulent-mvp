// Genererer utkast til e-post. ALDRI sendt automatisk — jf. prosjektregelen
// "ikke send ekte e-poster uten godkjenning". Utkastet lagres med status UTKAST
// og må aktivt godkjennes og sendes manuelt av en administrator (senere: via
// tilkoblet Microsoft Graph-konto, når den er satt opp).

import { SITE_NAME } from "@/lib/content/site";

export type FirstContactDraftInput = {
  companyName: string;
  naceDescription?: string | null;
  municipality?: string | null;
};

export function draftFirstContactEmail(input: FirstContactDraftInput): { subject: string; body: string } {
  const subject = `Bedre kontroll på drift og lønnsomhet — ${input.companyName}`;

  const body = `Hei,

Jeg jobber med å hjelpe norske butikker, dagligvarebutikker, kiosker og serveringssteder${
    input.municipality ? ` i ${input.municipality}` : ""
  } med å forbedre lønnsomhet, bemanning og drift.

Jeg la merke til ${input.companyName}${
    input.naceDescription ? ` (${input.naceDescription})` : ""
  } og tenkte det kunne være relevant for dere.

Jeg tilbyr en kort, uforpliktende og gratis samtale om driften deres — ingen forpliktelser, bare en gjennomgang av hvor dere eventuelt kan hente ut mer lønnsomhet.

Har dere anledning til en 20-minutters samtale i løpet av de neste ukene?

Vennlig hilsen
[DITT NAVN]
${SITE_NAME}
[TELEFON] · [E-POST]

---
NB: Denne e-posten er et UTKAST generert av systemet og er ikke sendt. Den må
gjennomgås og godkjennes manuelt før utsendelse, og avsender må selv vurdere om
markedsføringslovens krav til samtykke/interesseavveining er oppfylt før kontakt.`;

  return { subject, body };
}

export type ReplyDraftInput = {
  incomingSubject: string;
  incomingSenderName?: string | null;
  incomingSummary: string; // kort sammendrag av hva kunden spurte om
};

export function draftReplyEmail(input: ReplyDraftInput): { subject: string; body: string } {
  const subject = input.incomingSubject.toLowerCase().startsWith("sv:")
    ? input.incomingSubject
    : `Sv: ${input.incomingSubject}`;

  const body = `Hei${input.incomingSenderName ? ` ${input.incomingSenderName}` : ""},

Takk for henvendelsen din${input.incomingSummary ? ` om ${input.incomingSummary}` : ""}.

[UTKAST — fyll inn konkret svar her før godkjenning. Systemet har ikke funnet på
detaljer i svaret; dette er kun en mal.]

Vennlig hilsen
[DITT NAVN]
${SITE_NAME}

---
NB: Dette er et UTKAST og er ikke sendt. Gjennomgå og rediger innholdet, og
godkjenn før utsendelse.`;

  return { subject, body };
}
