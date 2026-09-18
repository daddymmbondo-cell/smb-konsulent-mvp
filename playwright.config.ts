import { defineConfig, devices } from "@playwright/test";

// E2E-tester kjører mot en lokalt startet instans av appen (npm run dev).
// Krever at .env er satt opp med en ekte (eller test-) database, siden
// testene går gjennom ekte skjemainnsending og innlogging — ikke mocket.

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  fullyParallel: false, // testene deler database-tilstand — kjør sekvensielt
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Next.js' utviklingsserver kompilerer hver side ved første besøk, som kan ta
  // noen ekstra sekunder for tyngre sider (f.eks. dashboardet med grafer og
  // flere databasekall). Litt raushet her unngår falske feil på "kald" første
  // navigering, uten å skjule reelle feil i appen.
  expect: {
    timeout: 10_000,
  },
  timeout: 45_000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
