// Regelbasert forslag til ukeplan — bygger på det som allerede finnes i systemet
// (leads, godkjente kundeemner, e-postutkast, kartlegginger). Ingen KI, ingen
// oppdiktede oppgaver — kun konkrete, sporbare elementer fra databasen.

export type WeekPlanInputs = {
  newLeadsCount: number;
  approvedSuggestionsWithoutDraft: number;
  approvedEmailDraftsReadyToSend: number;
  assessmentsAwaitingReport: number; // innsendt, men rapport ikke fulgt opp med samtale
  bookingsWithoutConfirmedTime: number;
};

export type WeekPlanItem = {
  day: "Mandag" | "Tirsdag" | "Onsdag" | "Torsdag" | "Fredag";
  task: string;
  reason: string;
};

export function generateWeekPlan(inputs: WeekPlanInputs): WeekPlanItem[] {
  const items: WeekPlanItem[] = [];

  if (inputs.newLeadsCount > 0) {
    items.push({
      day: "Mandag",
      task: `Følg opp ${inputs.newLeadsCount} nye lead${inputs.newLeadsCount > 1 ? "s" : ""}`,
      reason: "Nye henvendelser bør kontaktes tidlig i uken mens de er ferske.",
    });
  }

  if (inputs.bookingsWithoutConfirmedTime > 0) {
    items.push({
      day: "Mandag",
      task: `Bekreft tidspunkt for ${inputs.bookingsWithoutConfirmedTime} ønsket(e) samtale(r)`,
      reason: "Ubekreftede booking-forespørsler venter på et konkret tidspunkt.",
    });
  }

  if (inputs.approvedSuggestionsWithoutDraft > 0) {
    items.push({
      day: "Tirsdag",
      task: `Lag e-postutkast for ${inputs.approvedSuggestionsWithoutDraft} godkjente kundeemner`,
      reason: "Godkjente emner uten utkast er klare for neste steg i prospektering.",
    });
  }

  if (inputs.approvedEmailDraftsReadyToSend > 0) {
    items.push({
      day: "Onsdag",
      task: `Send ${inputs.approvedEmailDraftsReadyToSend} godkjente e-post${
        inputs.approvedEmailDraftsReadyToSend > 1 ? "er" : ""
      }`,
      reason: "Godkjente utkast bør sendes ut manuelt (eller via tilkoblet konto når klart).",
    });
  }

  if (inputs.assessmentsAwaitingReport > 0) {
    items.push({
      day: "Torsdag",
      task: `Gå gjennom ${inputs.assessmentsAwaitingReport} nylig innsendte kartlegginger`,
      reason: "Kunder som nettopp har sendt inn kartleggingen venter på oppfølging og rapportgjennomgang.",
    });
  }

  items.push({
    day: "Fredag",
    task: "Oppsummer uken: status på leads, sendte e-poster og kommende samtaler",
    reason: "Fast ukentlig rutine for oversikt og planlegging av neste uke.",
  });

  return items;
}
