import { describe, it, expect } from "vitest";
import { draftFirstContactEmail, draftReplyEmail } from "@/lib/leads/email-draft";
import { SITE_NAME } from "@/lib/content/site";

// lib/leads/email-draft.ts er kjernen i "coworker"-utkastfunksjonen (se
// docs/product-requirements.md / PLAN.md). Ingen tester fantes for denne.
// Viktigst å verifisere: utkast dikter ALDRI opp konkrete detaljer (jf.
// CLAUDE.md "ikke finn på kundecaser...") og markeres alltid tydelig som
// utkast som ikke er sendt.

describe("draftFirstContactEmail", () => {
  it("inkluderer firmanavnet i emnefeltet", () => {
    const draft = draftFirstContactEmail({ companyName: "Kolonial Øst AS" });
    expect(draft.subject).toContain("Kolonial Øst AS");
  });

  it("inkluderer firmanavnet og en tydelig UTKAST-markering i brødteksten", () => {
    const draft = draftFirstContactEmail({ companyName: "Kolonial Øst AS" });
    expect(draft.body).toContain("Kolonial Øst AS");
    expect(draft.body).toContain("UTKAST");
    expect(draft.body).toContain(SITE_NAME);
  });

  it("nevner kommune når den er oppgitt", () => {
    const draft = draftFirstContactEmail({ companyName: "Kolonial Øst AS", municipality: "Lillestrøm" });
    expect(draft.body).toContain("Lillestrøm");
  });

  it("utelater kommune-setningen når den ikke er oppgitt", () => {
    const draft = draftFirstContactEmail({ companyName: "Kolonial Øst AS" });
    expect(draft.body).not.toMatch(/i\s*$/m);
  });

  it("nevner NACE-bransjebeskrivelse når den er oppgitt, men dikter ikke opp noe når den mangler", () => {
    const medBransje = draftFirstContactEmail({
      companyName: "Kolonial Øst AS",
      naceDescription: "Butikkhandel med dagligvarer",
    });
    expect(medBransje.body).toContain("Butikkhandel med dagligvarer");

    const utenBransje = draftFirstContactEmail({ companyName: "Kolonial Øst AS" });
    expect(utenBransje.body).not.toContain("()");
  });

  it("håndterer null likt som fravær (naceDescription/municipality)", () => {
    const draft = draftFirstContactEmail({
      companyName: "Kolonial Øst AS",
      naceDescription: null,
      municipality: null,
    });
    expect(draft.body).toContain("Kolonial Øst AS");
    expect(draft.body).not.toContain("null");
  });
});

describe("draftReplyEmail", () => {
  it("legger til 'Sv:'-prefiks når emnet ikke allerede har det", () => {
    const draft = draftReplyEmail({
      incomingSubject: "Spørsmål om priser",
      incomingSummary: "priser",
    });
    expect(draft.subject).toBe("Sv: Spørsmål om priser");
  });

  it("dobler ikke 'Sv:'-prefikset hvis det allerede finnes (case-insensitivt)", () => {
    const draft = draftReplyEmail({
      incomingSubject: "SV: Spørsmål om priser",
      incomingSummary: "priser",
    });
    expect(draft.subject).toBe("SV: Spørsmål om priser");
  });

  it("inkluderer avsenders navn i hilsen når det er oppgitt", () => {
    const draft = draftReplyEmail({
      incomingSubject: "Spørsmål",
      incomingSenderName: "Per",
      incomingSummary: "åpningstider",
    });
    expect(draft.body).toContain("Hei Per,");
  });

  it("markerer alltid brødteksten som et ikke-sendt UTKAST som må redigeres", () => {
    const draft = draftReplyEmail({
      incomingSubject: "Spørsmål",
      incomingSummary: "åpningstider",
    });
    expect(draft.body).toContain("UTKAST");
    expect(draft.body).toContain("ikke sendt");
  });

  it("dikter ikke opp et konkret svar i innholdet", () => {
    const draft = draftReplyEmail({
      incomingSubject: "Spørsmål",
      incomingSummary: "åpningstider",
    });
    expect(draft.body).toContain("Systemet har ikke funnet på");
  });
});
