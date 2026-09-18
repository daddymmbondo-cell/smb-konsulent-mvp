# Microsoft 365-integrasjon — oppsett

## 1. Opprett appregistrering i Azure AD

1. Gå til [portal.azure.com](https://portal.azure.com) → **Azure Active Directory** → **App registrations** → **New registration**.
2. Gi den et navn, f.eks. «SMB-konsulentplattform».
3. Under **Certificates & secrets**, opprett en ny **Client secret** — kopier verdien med én gang (vises kun én gang).
4. Noter ned:
   - **Application (client) ID** → `AZURE_AD_CLIENT_ID`
   - **Directory (tenant) ID** → `AZURE_AD_TENANT_ID`
   - Client secret-verdien → `AZURE_AD_CLIENT_SECRET`

## 2. Gi API-tillatelser (application permissions)

Under **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions**, legg til:

- `Mail.Send`
- `Mail.ReadWrite`
- `Calendars.ReadWrite`

Trykk deretter **Grant admin consent** — dette krever administratorrettigheter i tenanten.

> Application permissions (i motsetning til delegated) lar systemet sende e-post og
> lese/skrive kalender fra en fast postboks uten at noen er innlogget. Dette er
> nødvendig siden dette er et bakgrunnssystem, ikke noe en enkeltbruker styrer
> interaktivt.

## 3. Velg hvilken postboks systemet skal bruke

Sett `MICROSOFT_MAILBOX_ADDRESS` til e-postadressen til postboksen som skal sende/motta
(f.eks. en delt postboks eller din egen). Denne kontoen må finnes i samme tenant.

## 4. Fyll inn `.env`

```bash
AZURE_AD_CLIENT_ID="..."
AZURE_AD_CLIENT_SECRET="..."
AZURE_AD_TENANT_ID="..."
MICROSOFT_MAILBOX_ADDRESS="post@dinbedrift.no"
MICROSOFT_INTEGRATION_ENABLED="true"
```

## 5. Test

- **Send e-post:** Gå til `/admin/e-post-utkast`, godkjenn et utkast, fyll inn en
  mottaker-e-post, trykk «Send nå». Du bør få meldingen «Sendt via Microsoft 365».
- **Kalender:** Gå til `/admin/leads`, bekreft et tidspunkt for en booking — hendelsen
  skal dukke opp i kalenderen til postboksen.
- **Innboks:** Gå til `/admin/innboks` — du bør se de siste meldingene i postboksen.

## Sikkerhet

- Client secret skal ALDRI committes til Git — kun i `.env` (som er i `.gitignore`).
- Roter secreten jevnlig (Azure AD lar deg sette utløpsdato ved opprettelse).
- Vurder å bruke et sertifikat i stedet for client secret for produksjon (mer robust,
  men krever litt mer oppsett — ta kontakt hvis dette er ønskelig).
