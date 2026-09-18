import { describe, it, expect } from "vitest";
import {
  calculateGrossProfit,
  calculateGrossMargin,
  calculateLaborCostShare,
  calculateShrinkageShare,
} from "@/lib/metrics/calculate";

describe("calculateGrossProfit", () => {
  it("beregner bruttofortjeneste når data finnes", () => {
    const result = calculateGrossProfit({ monthlyRevenue: 100000, goodsCost: 40000 });
    expect(result.value).toBe(60000);
    expect(result.isEstimate).toBe(false);
  });

  it("markerer som estimat når varekostnad mangler", () => {
    const result = calculateGrossProfit({ monthlyRevenue: 100000 });
    expect(result.value).toBeNull();
    expect(result.isEstimate).toBe(true);
    expect(result.missingInputs).toContain("varekostnad");
  });
});

describe("calculateGrossMargin", () => {
  it("beregner margin korrekt", () => {
    const result = calculateGrossMargin({ monthlyRevenue: 100000, goodsCost: 40000 });
    expect(result.value).toBeCloseTo(0.6);
  });

  it("returnerer null ved omsetning på 0", () => {
    const result = calculateGrossMargin({ monthlyRevenue: 0, goodsCost: 0 });
    expect(result.value).toBeNull();
  });
});

describe("calculateLaborCostShare", () => {
  it("beregner personalkostnadsandel", () => {
    const result = calculateLaborCostShare({ monthlyRevenue: 200000, laborCost: 60000 });
    expect(result.value).toBeCloseTo(0.3);
    expect(result.isEstimate).toBe(false);
  });
});

describe("calculateShrinkageShare", () => {
  it("beregner svinnandel og markerer estimat ved manglende data", () => {
    const complete = calculateShrinkageShare({ monthlyRevenue: 100000, shrinkage: 2000 });
    expect(complete.value).toBeCloseTo(0.02);

    const incomplete = calculateShrinkageShare({ monthlyRevenue: 100000 });
    expect(incomplete.value).toBeNull();
    expect(incomplete.missingInputs).toContain("svinn");
  });
});
