import { describe, it, expect } from "vitest";
import { buildLeadFunnel, buildSuggestedLeadFunnel, calculateConversionRate } from "@/lib/dashboard/aggregate";

describe("buildLeadFunnel", () => {
  it("fyller inn 0 for statuser uten treff, i riktig rekkefølge", () => {
    const funnel = buildLeadFunnel([{ status: "NY", count: 5 }]);
    expect(funnel[0]).toEqual({ label: "Ny", value: 5 });
    expect(funnel[1]).toEqual({ label: "Kontaktet", value: 0 });
    expect(funnel).toHaveLength(6);
  });
});

describe("buildSuggestedLeadFunnel", () => {
  it("mapper status til norske etiketter", () => {
    const funnel = buildSuggestedLeadFunnel([{ status: "GODKJENT", count: 3 }]);
    expect(funnel.find((f) => f.label === "Godkjent")?.value).toBe(3);
  });
});

describe("calculateConversionRate", () => {
  it("beregner konverteringsrate", () => {
    expect(calculateConversionRate(5, 20)).toBe(0.25);
  });

  it("returnerer null ved 0 totalt for å unngå divisjon på 0", () => {
    expect(calculateConversionRate(0, 0)).toBeNull();
  });
});
