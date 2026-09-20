// Rene, testbare funksjoner for nøkkeltallsberegning.
// Prinsipp fra spesifikasjonen: skill alltid mellom innrapporterte tall,
// beregnede tall og estimater. Ingenting her skal fremstå som regnskapsmessig sannhet.

export type AssessmentFinancials = {
  monthlyRevenue?: number | null;
  goodsCost?: number | null;
  laborCost?: number | null;
  rentCost?: number | null;
  electricityCost?: number | null;
  transportCost?: number | null;
  marketingCost?: number | null;
  otherFixedCosts?: number | null;
  shrinkage?: number | null;
};

export type CalculatedMetric = {
  key: string;
  label: string;
  value: number | null;
  unit: "kr" | "%" | "andel";
  isEstimate: boolean;
  missingInputs: string[];
};

function sumCosts(f: AssessmentFinancials): { total: number; missing: string[] } {
  const parts: Array<[string, number | null | undefined]> = [
    ["varekostnad", f.goodsCost],
    ["lønnskostnader", f.laborCost],
    ["husleie", f.rentCost],
    ["strøm", f.electricityCost],
    ["transport", f.transportCost],
    ["markedsføring", f.marketingCost],
    ["andre faste kostnader", f.otherFixedCosts],
  ];
  const missing = parts.filter(([, v]) => v == null).map(([label]) => label);
  const total = parts.reduce((sum, [, v]) => sum + (v ?? 0), 0);
  return { total, missing };
}

export function calculateGrossProfit(f: AssessmentFinancials): CalculatedMetric {
  const missing: string[] = [];
  if (f.monthlyRevenue == null) missing.push("omsetning");
  if (f.goodsCost == null) missing.push("varekostnad");

  const value =
    f.monthlyRevenue != null && f.goodsCost != null ? f.monthlyRevenue - f.goodsCost : null;

  return {
    key: "bruttofortjeneste",
    label: "Bruttofortjeneste",
    value,
    unit: "kr",
    isEstimate: missing.length > 0,
    missingInputs: missing,
  };
}

export function calculateGrossMargin(f: AssessmentFinancials): CalculatedMetric {
  const gross = calculateGrossProfit(f);
  const value =
    gross.value != null && f.monthlyRevenue && f.monthlyRevenue > 0
      ? gross.value / f.monthlyRevenue
      : null;

  return {
    key: "bruttofortjenestemargin",
    label: "Bruttofortjenestemargin",
    value,
    unit: "%",
    isEstimate: gross.isEstimate,
    missingInputs: gross.missingInputs,
  };
}

export function calculateLaborCostShare(f: AssessmentFinancials): CalculatedMetric {
  const missing: string[] = [];
  if (f.laborCost == null) missing.push("lønnskostnader");
  if (!f.monthlyRevenue) missing.push("omsetning");

  const value =
    f.laborCost != null && f.monthlyRevenue ? f.laborCost / f.monthlyRevenue : null;

  return {
    key: "personalkostnadsandel",
    label: "Personalkostnadsandel",
    value,
    unit: "%",
    isEstimate: missing.length > 0,
    missingInputs: missing,
  };
}

export function calculateCostShare(f: AssessmentFinancials): CalculatedMetric {
  const { total, missing } = sumCosts(f);
  const revenueMissing = !f.monthlyRevenue;
  const value = f.monthlyRevenue ? total / f.monthlyRevenue : null;

  return {
    key: "kostnadsandel",
    label: "Kostnadsandel",
    value,
    unit: "%",
    isEstimate: missing.length > 0 || revenueMissing,
    missingInputs: revenueMissing ? [...missing, "omsetning"] : missing,
  };
}

export function calculateEstimatedOperatingResult(f: AssessmentFinancials): CalculatedMetric {
  const { total, missing } = sumCosts(f);
  const revenueMissing = !f.monthlyRevenue && f.monthlyRevenue !== 0;
  const value = f.monthlyRevenue != null ? f.monthlyRevenue - total : null;

  return {
    key: "estimert_driftsresultat",
    label: "Estimert driftsresultat",
    value,
    unit: "kr",
    isEstimate: missing.length > 0 || revenueMissing,
    missingInputs: revenueMissing ? [...missing, "omsetning"] : missing,
  };
}

export function calculateShrinkageShare(f: AssessmentFinancials): CalculatedMetric {
  const missing: string[] = [];
  if (f.shrinkage == null) missing.push("svinn");
  if (!f.monthlyRevenue) missing.push("omsetning");

  const value = f.shrinkage != null && f.monthlyRevenue ? f.shrinkage / f.monthlyRevenue : null;

  return {
    key: "svinnandel",
    label: "Svinnandel",
    value,
    unit: "%",
    isEstimate: missing.length > 0,
    missingInputs: missing,
  };
}

// Statisk oppslag av label/enhet per nøkkeltall-key. Brukes til å tolke
// lagrede Metric-rader (som kun har key+value) uten å regne dem på nytt —
// f.eks. for utviklingsoversikten som viser flere tidligere kartlegginger.
// Må holdes i sync med calculateAllMetrics() under.
export const METRIC_META: Record<string, { label: string; unit: "kr" | "%" | "andel" }> = {
  bruttofortjeneste: { label: "Bruttofortjeneste", unit: "kr" },
  bruttofortjenestemargin: { label: "Bruttofortjenestemargin", unit: "%" },
  personalkostnadsandel: { label: "Personalkostnadsandel", unit: "%" },
  kostnadsandel: { label: "Kostnadsandel", unit: "%" },
  estimert_driftsresultat: { label: "Estimert driftsresultat", unit: "kr" },
  svinnandel: { label: "Svinnandel", unit: "%" },
};

// Rekkefølgen nøkkeltallene skal vises i på tvers av oversikts- og rapportsider.
export const METRIC_KEY_ORDER = Object.keys(METRIC_META);

export function calculateAllMetrics(f: AssessmentFinancials): CalculatedMetric[] {
  return [
    calculateGrossProfit(f),
    calculateGrossMargin(f),
    calculateLaborCostShare(f),
    calculateCostShare(f),
    calculateEstimatedOperatingResult(f),
    calculateShrinkageShare(f),
  ];
}
