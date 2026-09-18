import { describe, it, expect } from "vitest";
import { generateRecommendations } from "@/lib/recommendations/engine";
import { calculateAllMetrics } from "@/lib/metrics/calculate";

describe("generateRecommendations", () => {
  it("foreslår bemanningsanalyse ved høy personalkostnadsandel", () => {
    const metrics = calculateAllMetrics({
      monthlyRevenue: 200000,
      laborCost: 90000, // 45 % — over terskel på 35 %
      goodsCost: 60000,
    });
    const recs = generateRecommendations(metrics, {});
    expect(recs.some((r) => r.title.includes("bemanning"))).toBe(true);
  });

  it("foreslår svinnrutiner ved høy svinnandel", () => {
    const metrics = calculateAllMetrics({
      monthlyRevenue: 100000,
      shrinkage: 5000, // 5 % — over terskel på 2 %
      goodsCost: 40000,
    });
    const recs = generateRecommendations(metrics, {});
    expect(recs.some((r) => r.title.toLowerCase().includes("svinn"))).toBe(true);
  });

  it("returnerer maks 6 anbefalinger, sortert etter prioritet", () => {
    const metrics = calculateAllMetrics({
      monthlyRevenue: 100000,
      laborCost: 60000,
      shrinkage: 5000,
      goodsCost: 80000,
    });
    const recs = generateRecommendations(metrics, {
      managementChallenges: "Mangler faste møter",
      digitalToolsUsage: "Alt gjøres manuelt i Excel",
    });
    expect(recs.length).toBeLessThanOrEqual(6);
    const priorities = recs.map((_, i) => i);
    expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
  });

  it("gir ingen anbefalinger når alle nøkkeltall er sunne og fullstendige", () => {
    const metrics = calculateAllMetrics({
      monthlyRevenue: 100000,
      laborCost: 20000,
      goodsCost: 30000,
      shrinkage: 500,
      rentCost: 10000,
      electricityCost: 2000,
      transportCost: 1000,
      marketingCost: 1000,
      otherFixedCosts: 1000,
    });
    const recs = generateRecommendations(metrics, {});
    expect(recs.length).toBe(0);
  });
});
