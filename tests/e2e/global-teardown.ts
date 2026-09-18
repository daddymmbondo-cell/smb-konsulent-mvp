// Automatisk opprydning av E2E-testdata etter hver testkjøring, slik at
// lead-listen og dashboardet ikke fylles opp med testdata over tid.
import { execSync } from "child_process";

export default async function globalTeardown() {
  try {
    execSync("npm run cleanup:e2e-data", { stdio: "inherit" });
  } catch {
    console.warn(
      "Kunne ikke rydde opp E2E-testdata automatisk — kjør `npm run cleanup:e2e-data` manuelt ved behov."
    );
  }
}
