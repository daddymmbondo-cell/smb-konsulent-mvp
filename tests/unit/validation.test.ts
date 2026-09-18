import { describe, it, expect } from "vitest";
import { leadSchema, registerSchema, loginSchema, assessmentSchema } from "@/lib/validation";

// PLAN.md pkt. 8 sier Vitest skal dekke "validering" — denne filen tetter det
// gapet (leadSchema/registerSchema/loginSchema/assessmentSchema hadde ingen
// tester før nå).

describe("leadSchema", () => {
  const gyldigLead = {
    name: "Kari Nordmann",
    businessName: "Nordmann Kolonial AS",
    email: "kari@nordmannkolonial.no",
    phone: "912 34 567",
    consentGiven: true as const,
  };

  it("godtar et gyldig, minimalt lead", () => {
    const result = leadSchema.safeParse(gyldigLead);
    expect(result.success).toBe(true);
  });

  it("avviser lead uten samtykke", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, consentGiven: false });
    expect(result.success).toBe(false);
  });

  it("avviser ugyldig e-postadresse", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, email: "ikke-en-epost" });
    expect(result.success).toBe(false);
  });

  it("avviser telefonnummer med bokstaver", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, phone: "call-me-maybe" });
    expect(result.success).toBe(false);
  });

  it("avviser for korte navn og virksomhetsnavn", () => {
    expect(leadSchema.safeParse({ ...gyldigLead, name: "K" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...gyldigLead, businessName: "A" }).success).toBe(false);
  });

  it("avviser ukjente felter (.strict())", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, ekstraFelt: "uventet" });
    expect(result.success).toBe(false);
  });

  it("avviser hvis honeypot-feltet 'website' er utfylt (botbeskyttelse)", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, website: "http://spam.eksempel" });
    expect(result.success).toBe(false);
  });

  it("godtar tomt honeypot-felt", () => {
    const result = leadSchema.safeParse({ ...gyldigLead, website: "" });
    expect(result.success).toBe(true);
  });
});

describe("registerSchema", () => {
  const gyldigRegistrering = {
    name: "Ola Nordmann",
    organizationName: "Ola Butikk AS",
    email: "ola@olabutikk.no",
    password: "sikkertpassord123",
  };

  it("godtar gyldig registrering", () => {
    expect(registerSchema.safeParse(gyldigRegistrering).success).toBe(true);
  });

  it("avviser passord kortere enn 8 tegn", () => {
    const result = registerSchema.safeParse({ ...gyldigRegistrering, password: "kort1" });
    expect(result.success).toBe(false);
  });

  it("avviser ukjente felter (.strict())", () => {
    const result = registerSchema.safeParse({ ...gyldigRegistrering, rolle: "admin" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("godtar gyldig e-post og ikke-tomt passord", () => {
    expect(loginSchema.safeParse({ email: "test@eksempel.no", password: "x" }).success).toBe(true);
  });

  it("avviser tomt passord", () => {
    expect(loginSchema.safeParse({ email: "test@eksempel.no", password: "" }).success).toBe(false);
  });

  it("avviser ugyldig e-post", () => {
    expect(loginSchema.safeParse({ email: "ikke-epost", password: "x" }).success).toBe(false);
  });
});

describe("assessmentSchema", () => {
  it("godtar et helt tomt objekt (alle felt er individuelt valgfrie, submit default false)", () => {
    const result = assessmentSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.submit).toBe(false);
    }
  });

  it("konverterer numeriske strenger fra skjemafelt (z.coerce.number)", () => {
    const result = assessmentSchema.safeParse({ employeeCount: "12", monthlyRevenue: "250000" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.employeeCount).toBe(12);
      expect(result.data.monthlyRevenue).toBe(250000);
    }
  });

  it("avviser negative kostnader", () => {
    expect(assessmentSchema.safeParse({ laborCost: -1000 }).success).toBe(false);
  });

  it("avviser sykefraværsprosent over 100", () => {
    expect(assessmentSchema.safeParse({ sickLeavePercent: 150 }).success).toBe(false);
  });

  it("avviser ukjente felter (.strict())", () => {
    expect(assessmentSchema.safeParse({ ukjentFelt: "test" }).success).toBe(false);
  });

  it("godtar submit=true for endelig innsending", () => {
    const result = assessmentSchema.safeParse({ submit: true, businessType: "Dagligvare" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.submit).toBe(true);
    }
  });
});
