import { ConfidentialClientApplication } from "@azure/msal-node";

// App-only (client credentials) autentisering mot Microsoft Graph.
// Krever at en administrator har godkjent applikasjonstillatelser (application
// permissions) i Azure AD — IKKE delegerte tillatelser — siden systemet skal
// kunne sende/lese e-post fra en fast postboks uten at en bruker er innlogget.
//
// Nødvendige API-tillatelser i Azure AD-appregistreringen (application permissions,
// med admin-samtykke):
//   - Mail.Send
//   - Mail.ReadWrite
//   - Calendars.ReadWrite
//
// Se docs/microsoft-integrasjon.md for full oppsettsveiledning.

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} mangler. Sett opp Microsoft 365-integrasjonen i .env før denne funksjonen kan brukes.`
    );
  }
  return value;
}

let msalApp: ConfidentialClientApplication | null = null;

function getMsalApp(): ConfidentialClientApplication {
  if (msalApp) return msalApp;

  msalApp = new ConfidentialClientApplication({
    auth: {
      clientId: getRequiredEnv("AZURE_AD_CLIENT_ID"),
      authority: `https://login.microsoftonline.com/${getRequiredEnv("AZURE_AD_TENANT_ID")}`,
      clientSecret: getRequiredEnv("AZURE_AD_CLIENT_SECRET"),
    },
  });
  return msalApp;
}

export async function getGraphAccessToken(): Promise<string> {
  const app = getMsalApp();
  const result = await app.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  if (!result?.accessToken) {
    throw new Error("Klarte ikke å hente access token fra Microsoft Graph.");
  }

  return result.accessToken;
}

export function isMicrosoftIntegrationEnabled(): boolean {
  return (
    process.env.MICROSOFT_INTEGRATION_ENABLED === "true" &&
    Boolean(process.env.AZURE_AD_CLIENT_ID) &&
    Boolean(process.env.AZURE_AD_CLIENT_SECRET) &&
    Boolean(process.env.AZURE_AD_TENANT_ID)
  );
}

export function getGraphMailbox(): string {
  return getRequiredEnv("MICROSOFT_MAILBOX_ADDRESS");
}
