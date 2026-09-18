import { test, expect, Page } from "@playwright/test";

// Bruker seed-testbrukeren fra prisma/seed.ts.
const ADMIN_EMAIL = "admin@eksempel-testdata.no";
const ADMIN_PASSWORD = "EndreMeg123!";
const CUSTOMER_EMAIL = "kunde@eksempel-testdata.no";
const CUSTOMER_PASSWORD = "EndreMeg123!";

// Logger inn og venter på at selve autentiseringskallet er fullført (ikke bare
// at knappen ble klikket) — unngår at neste navigering skjer før økten er satt.
async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/logg-inn");
  await page.getByLabel("E-post").fill(email);
  await page.getByLabel("Passord").fill(password);

  const authResponse = page.waitForResponse(
    (res) => res.url().includes("/api/auth/callback/credentials") && res.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Logg inn" }).click();
  await authResponse;
}

test.describe("Adminflyt", () => {
  test("kan logge inn som admin og se dashboard", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    await page.goto("/admin/dashboard");
    // Ekstra raushet her: dette er typisk det aller første databasekallet i
    // hele testkjøringen, og en serverløs database (Neon) som har vært
    // inaktiv bruker noen ekstra sekunder på å "våkne" ved første spørring.
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 25_000 });
    await expect(page.getByText("Totalt antall leads")).toBeVisible();
  });

  test("ser leadlisten i backoffice", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    await page.goto("/admin/leads");
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  });
});

test.describe("Tilgangskontroll", () => {
  test("en vanlig kunde nektes tilgang til adminsidene", async ({ page }) => {
    await loginAs(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);

    // Skal omdirigeres bort fra adminsiden (redirect til /logg-inn i vår implementasjon)
    await page.goto("/admin/dashboard");
    await expect(page).not.toHaveURL(/\/admin\/dashboard/);
  });

  test("uinnlogget bruker nektes tilgang til kundeportalen", async ({ page }) => {
    await page.goto("/portal");
    await expect(page).toHaveURL(/\/logg-inn/);
  });
});
