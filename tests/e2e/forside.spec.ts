import { test, expect } from "@playwright/test";

test.describe("Forside", () => {
  test("viser hovedbudskap og CTA-knapper", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("lønnsom");
    await expect(page.getByRole("link", { name: /Bestill gratis kartleggingssamtale/i }).first()).toBeVisible();
  });

  test("navigasjon til tjenester og priser fungerer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Tjenester" }).click();
    await expect(page).toHaveURL(/\/tjenester/);
    await expect(page.getByRole("heading", { name: "Tjenester" })).toBeVisible();

    await page.goto("/priser");
    await expect(page.getByRole("heading", { name: "Priser" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Startanalyse" })).toBeVisible();
  });
});
