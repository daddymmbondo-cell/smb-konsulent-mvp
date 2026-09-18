import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

// lib/rate-limit.ts hadde ingen tester før nå, selv om rate-limiting på
// offentlige skjemaer er et av sikkerhetskravene i PLAN.md pkt. 7.

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tillater de første 'limit' forespørslene innenfor vinduet", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, 5, 60_000)).toBe(false);
    }
  });

  it("blokkerer forespørsel nummer 'limit + 1' innenfor samme vindu", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key, 5, 60_000);
    }
    expect(isRateLimited(key, 5, 60_000)).toBe(true);
  });

  it("holder ulike nøkler (f.eks. IP-adresser) helt uavhengige av hverandre", () => {
    const keyA = `key-a-${Math.random()}`;
    const keyB = `key-b-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(keyA, 5, 60_000);
    }
    // A er nå over grensen, B skal fortsatt være helt fersk
    expect(isRateLimited(keyA, 5, 60_000)).toBe(true);
    expect(isRateLimited(keyB, 5, 60_000)).toBe(false);
  });

  it("nullstiller telleren når vinduet er utløpt", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key, 5, 60_000);
    }
    expect(isRateLimited(key, 5, 60_000)).toBe(true);

    // Flytt klokken forbi vinduet (60s)
    vi.setSystemTime(new Date("2026-01-01T12:01:01Z"));

    expect(isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("bruker standardverdier (limit=5, windowMs=60000) når ingen er angitt", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
    expect(isRateLimited(key)).toBe(true);
  });
});
