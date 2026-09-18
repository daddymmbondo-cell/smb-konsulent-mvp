import { CalculatedMetric } from "@/lib/metrics/calculate";

export type RecommendationDraft = {
  title: string;
  problem: string;
  whyItMatters: string;
  action: string;
  effort: string;
  priority: number; // 1 = høyest
  firstStep: string;
  whatToMeasure: string;
};

type MetricsByKey = Record<string, CalculatedMetric | undefined>;

function toMap(metrics: CalculatedMetric[]): MetricsByKey {
  return Object.fromEntries(metrics.map((m) => [m.key, m]));
}

/**
 * Regelbasert anbefalingsmotor (ingen KI i produksjon ennå, jf. spesifikasjonens §11).
 * Reglene er bevisst enkle og forsiktige i språket — dette er startpunktet,
 * og skal justeres etter hvert som virkelige kartlegginger kommer inn.
 */
export function generateRecommendations(
  metrics: CalculatedMetric[],
  context: { staffingChallenges?: string | null; managementChallenges?: string | null; digitalToolsUsage?: string | null }
): RecommendationDraft[] {
  const m = toMap(metrics);
  const recs: RecommendationDraft[] = [];

  const laborShare = m["personalkostnadsandel"];
  if (laborShare?.value != null && laborShare.value > 0.35) {
    recs.push({
      title: "Gjennomgå bemanningsplanlegging",
      problem: "Personalkostnadsandelen er høyere enn det som er vanlig for bransjen.",
      whyItMatters:
        "Høy personalkostnadsandel kan tyde på over- eller feilbemanning i deler av åpningstiden, og påvirker lønnsomheten direkte.",
      action: "Gjennomfør en bemanningsanalyse mot faktiske salgstopper og -bunner.",
      effort: "1–2 uker",
      priority: 1,
      firstStep: "Kartlegg timeforbruk mot omsetning per time i en typisk uke.",
      whatToMeasure: "Personalkostnadsandel per uke, salg per arbeidstime.",
    });
  }

  const shrinkage = m["svinnandel"];
  if (shrinkage?.value != null && shrinkage.value > 0.02) {
    recs.push({
      title: "Innfør bedre svinnrutiner",
      problem: "Svinnandelen er høyere enn ønsket nivå.",
      whyItMatters: "Svinn går direkte på bunnlinjen og er ofte mulig å redusere med enkle rutineendringer.",
      action: "Gå gjennom vareflyt, holdbarhetsstyring og registreringsrutiner for svinn.",
      effort: "2–4 uker",
      priority: 2,
      firstStep: "Registrer svinn systematisk per varegruppe i to uker.",
      whatToMeasure: "Svinnandel per varegruppe.",
    });
  }

  const grossMargin = m["bruttofortjenestemargin"];
  if (grossMargin?.value != null && grossMargin.value < 0.3) {
    recs.push({
      title: "Vurder sortiment, innkjøp og prisstruktur",
      problem: "Bruttofortjenestemarginen er lavere enn ønskelig.",
      whyItMatters: "Lav bruttomargin begrenser handlingsrommet uansett hvor godt driften ellers går.",
      action: "Gjennomgå innkjøpsavtaler, sortimentsbredde og prissetting på nøkkelvarer.",
      effort: "2–3 uker",
      priority: 2,
      firstStep: "List de 20 mest solgte varene og deres dekningsbidrag.",
      whatToMeasure: "Bruttofortjenestemargin per varegruppe.",
    });
  }

  const missingKeyMetrics = metrics.filter((met) => met.isEstimate).length >= 3;
  if (missingKeyMetrics) {
    recs.push({
      title: "Etabler en enkel månedsrapport",
      problem: "Flere sentrale nøkkeltall mangler eller er ufullstendige.",
      whyItMatters: "Uten grunnleggende tall er det vanskelig å prioritere riktig tiltak.",
      action: "Sett opp en enkel månedlig rapport med omsetning, varekostnad og lønnskostnad.",
      effort: "1 uke å etablere, deretter løpende",
      priority: 3,
      firstStep: "Definer hvilke 5–6 tall som skal følges hver måned.",
      whatToMeasure: "Andel måneder med komplett rapportering.",
    });
  }

  if (context.managementChallenges && context.managementChallenges.trim().length > 0) {
    recs.push({
      title: "Etabler fast lederstruktur og møterytme",
      problem: "Det er rapportert utfordringer knyttet til lederoppfølging.",
      whyItMatters: "Manglende struktur på ledermøter gjør det vanskelig å følge opp mål og avvik løpende.",
      action: "Innfør faste ukentlige eller månedlige ledermøter med en enkel agendamal.",
      effort: "Lav — kan starte umiddelbart",
      priority: 3,
      firstStep: "Book første faste ledermøte og definer en enkel agenda.",
      whatToMeasure: "Andel gjennomførte møter i henhold til plan.",
    });
  }

  if (context.digitalToolsUsage && /manuel|papir|excel/i.test(context.digitalToolsUsage)) {
    recs.push({
      title: "Kartlegg mulighet for automatisering",
      problem: "Flere rutiner gjøres i dag manuelt.",
      whyItMatters: "Manuelle rutiner er tidkrevende og øker risikoen for feil.",
      action: "Kartlegg hvilke manuelle oppgaver som egner seg for enkel digitalisering eller automatisering.",
      effort: "1–2 uker for kartlegging",
      priority: 4,
      firstStep: "List de 3 mest tidkrevende manuelle rutinene.",
      whatToMeasure: "Tidsbruk før/etter på de aktuelle rutinene.",
    });
  }

  return recs
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6); // maks 6 anbefalinger i rapporten, jf. "tre prioriterte tiltak" + støtte
}
