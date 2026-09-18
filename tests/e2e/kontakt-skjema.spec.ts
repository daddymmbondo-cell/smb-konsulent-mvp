import { test, expect } from "@playwright/test";

// Bruker en unik e-post per kjøring slik at testen kan kjøres flere ganger
// uten å kollidere med tidligere innsendte leads.
function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}@e2e-test.no`;
}

test.describe("Kontakt og bestill samtale", () => {
  test("kan sende inn kontaktskjemaet", async ({ page }) => {
    await page.goto("/kontakt");

    await page.getByLabel("Navn", { exact: true }).fill("E2E Testperson");
    await page.getByLabel("Virksomhetsnavn").fill("E2E Test AS");
    await page.getByLabel("E-post").fill(uniqueEmail("kontakt"));
    await page.getByLabel("Telefon").fill("99999999");
    await page.getByLabel(/samtykker til å bli kontaktet/i).check();

    await page.getByRole("button", { name: "Send inn" }).click();

    await expect(page.getByText("Takk! Vi har mottatt henvendelsen din.")).toBeVisible();
  });

  test("kan bestille en kartleggingssamtale med ønsket tidspunkt", async ({ page }) => {
    await page.goto("/bestill-samtale");

    await page.getByLabel("Navn", { exact: true }).fill("E2E Bestiller");
    await page.getByLabel("Virksomhetsnavn").fill("E2E Bestiller AS");
    await page.getByLabel("E-post").fill(uniqueEmail("bestill"));
    await page.getByLabel("Telefon").fill("98989898");
    await page.getByLabel(/Ønsket tidspunkt/i).fill("Tirsdager etter kl. 14");
    await page.getByLabel(/samtykker til å bli kontaktet/i).check();

    await page.getByRole("button", { name: "Send inn" }).click();

    await expect(page.getByText("Takk! Vi har mottatt henvendelsen din.")).toBeVisible();
  });

  test("viser feilmelding når samtykke mangler", async ({ page }) => {
    await page.goto("/kontakt");

    await page.getByLabel("Navn", { exact: true }).fill("E2E Uten Samtykke");
    await page.getByLabel("Virksomhetsnavn").fill("E2E AS");
    await page.getByLabel("E-post").fill(uniqueEmail("nosamtykke"));
    await page.getByLabel("Telefon").fill("99999999");
    // Samtykke IKKE avkrysset

    await page.getByRole("button", { name: "Send inn" }).click();

    await expect(page.getByText(/samtykke/i).first()).toBeVisible();
  });
});
