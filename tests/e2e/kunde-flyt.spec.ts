import { test, expect } from "@playwright/test";

function uniqueEmail() {
  return `e2e-kunde-${Date.now()}@e2e-test.no`;
}

// Kjøres i rekkefølge — hvert steg bygger på forrige (samme bruker/sesjon).
test.describe.serial("Kundeflyt: registrering → kartlegging → rapport", () => {
  const email = uniqueEmail();
  const password = "TestPassord123!";

  test("kan registrere en ny kundekonto", async ({ page }) => {
    await page.goto("/registrer");

    await page.getByLabel("Ditt navn").fill("E2E Kunde");
    await page.getByLabel("Virksomhetsnavn").fill("E2E Kundebedrift AS");
    await page.getByLabel("E-post").fill(email);
    await page.getByLabel("Passord").fill(password);

    await page.getByRole("button", { name: "Opprett konto" }).click();

    // Skal sendes til portalen etter vellykket registrering + auto-innlogging
    await expect(page).toHaveURL(/\/portal/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /Hei, E2E Kundebedrift AS/ })).toBeVisible();
  });

  test("ser oppfordring til å starte kartlegging på dashboardet", async ({ page }) => {
    await page.goto("/logg-inn");
    await page.getByLabel("E-post").fill(email);
    await page.getByLabel("Passord").fill(password);
    await page.getByRole("button", { name: "Logg inn" }).click();

    await expect(page).toHaveURL(/\/portal/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Neste steg: fyll ut kartleggingen" })).toBeVisible();
  });

  test("kan fylle ut og sende inn kartleggingen, og se rapporten", async ({ page }) => {
    await page.goto("/logg-inn");
    await page.getByLabel("E-post").fill(email);
    await page.getByLabel("Passord").fill(password);
    await page.getByRole("button", { name: "Logg inn" }).click();
    await expect(page).toHaveURL(/\/portal/, { timeout: 15_000 });

    await page.goto("/portal/kartlegging");
    await expect(page.getByRole("heading", { name: "Del A: Virksomhet" })).toBeVisible();

    // Del A
    await page.getByLabel("Type virksomhet").fill("Dagligvare");
    await page.getByLabel("Antall ansatte").fill("10");
    await page.getByRole("button", { name: "Neste" }).click();

    // Del B: Salg
    await expect(page.getByRole("heading", { name: "Del B: Salg" })).toBeVisible();
    await page.getByLabel(/Månedlig omsetning/).fill("500000");
    await page.getByRole("button", { name: "Neste" }).click();

    // Del C: Kostnader
    await expect(page.getByRole("heading", { name: "Del C: Kostnader" })).toBeVisible();
    await page.getByLabel(/Lønnskostnader/).fill("200000");
    await page.getByLabel(/Varekostnad/).fill("250000");
    await page.getByRole("button", { name: "Neste" }).click();

    // Del D: Drift
    await expect(page.getByRole("heading", { name: "Del D: Drift" })).toBeVisible();
    await page.getByLabel(/Svinn per måned/).fill("15000");
    await page.getByRole("button", { name: "Neste" }).click();

    // Del E: Ledelse
    await expect(page.getByRole("heading", { name: "Del E: Ledelse" })).toBeVisible();
    await page.getByRole("button", { name: "Neste" }).click();

    // Del F: Mål — siste steg, send inn
    await expect(page.getByRole("heading", { name: "Del F: Mål" })).toBeVisible();
    await page.getByRole("button", { name: "Send inn kartlegging" }).click();

    // Skal havne på rapportsiden
    await expect(page).toHaveURL(/\/portal\/rapport/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /Rapport for/ })).toBeVisible();
    await expect(page.getByText("Nøkkeltall")).toBeVisible();
  });
});
