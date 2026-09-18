// Next.js' utviklingsserver kompilerer hver side første gang den besøkes.
// Uten oppvarming blir dette en "lotteri-feil" på den aller første testen i
// kjøringen (typisk den tyngste siden — dashboardet med grafer og flere
// databasekall). Dette scriptet besøker sidene én gang før testene starter,
// slik at kompileringen er unnagjort og selve testene måler faktisk
// funksjonalitet, ikke kald-start-tid.

async function warmUp(url: string) {
  try {
    await fetch(url, { redirect: "manual" });
  } catch {
    // Ignorer feil her — hvis siden faktisk er utilgjengelig, vil den vanlige
    // testen som besøker den samme siden uansett feile med en tydelig årsak.
  }
}

export default async function globalSetup() {
  const baseURL = "http://localhost:3000";
  const pages = ["/", "/kontakt", "/bestill-samtale", "/priser", "/tjenester", "/logg-inn", "/registrer", "/admin/dashboard", "/admin/leads"];

  for (const path of pages) {
    await warmUp(`${baseURL}${path}`);
  }
}
