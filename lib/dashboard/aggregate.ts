// Rene aggregeringsfunksjoner for backoffice-dashboardet.
// Tar rådata (allerede hentet fra databasen) og bygger visningsklare strukturer —
// holdt adskilt fra datahenting for å gjøre logikken testbar uten database.

export type LeadStatusCount = { status: string; count: number };

const LEAD_STATUS_LABELS: Record<string, string> = {
  NY: "Ny",
  KONTAKTET: "Kontaktet",
  MOTE_BOOKET: "Møte booket",
  TILBUD_SENDT: "Tilbud sendt",
  VUNNET: "Vunnet",
  TAPT: "Tapt",
};

const LEAD_STATUS_ORDER = ["NY", "KONTAKTET", "MOTE_BOOKET", "TILBUD_SENDT", "VUNNET", "TAPT"];

export function buildLeadFunnel(counts: LeadStatusCount[]): Array<{ label: string; value: number }> {
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c.count]));
  return LEAD_STATUS_ORDER.map((status) => ({
    label: LEAD_STATUS_LABELS[status] ?? status,
    value: byStatus[status] ?? 0,
  }));
}

export type SuggestedLeadStatusCount = { status: string; count: number };

const SUGGESTED_STATUS_LABELS: Record<string, string> = {
  FORESLATT: "Foreslått",
  GODKJENT: "Godkjent",
  KONVERTERT: "Konvertert",
  AVVIST: "Avvist",
};
const SUGGESTED_STATUS_ORDER = ["FORESLATT", "GODKJENT", "KONVERTERT", "AVVIST"];

export function buildSuggestedLeadFunnel(
  counts: SuggestedLeadStatusCount[]
): Array<{ label: string; value: number }> {
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c.count]));
  return SUGGESTED_STATUS_ORDER.map((status) => ({
    label: SUGGESTED_STATUS_LABELS[status] ?? status,
    value: byStatus[status] ?? 0,
  }));
}

export function calculateConversionRate(leadsWon: number, leadsTotal: number): number | null {
  if (leadsTotal === 0) return null;
  return leadsWon / leadsTotal;
}
