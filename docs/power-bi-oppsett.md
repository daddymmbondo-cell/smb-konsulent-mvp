# Power BI — oppsett

## Anbefaling: start med Power BI Desktop (gratis)

Du trenger ikke Power BI Pro/Premium for å komme i gang. Power BI Desktop er gratis og
kobles direkte mot databasen din. Du trenger først Pro (ca. 130–150 kr/bruker/mnd) den
dagen du skal **dele** rapporter i skyen med flere ansatte.

## 1. Opprett rapporteringsvisningene i databasen

Disse gjør det enklere å bygge rapporter i Power BI enn å jobbe direkte mot de
normaliserte tabellene:

```bash
npm run prisma:reporting-views
```

(Dette kjører `prisma/reporting-views.sql` mot databasen din via `psql`. Har du ikke
`psql` installert, kan du lime innholdet i filen inn i et hvilket som helst
Postgres-verktøy, f.eks. pgAdmin eller TablePlus.)

Dette oppretter fem visninger:

| Visning | Innhold |
|---|---|
| `vw_leads_rapport` | Leads med status, mottatt dato, bekreftet samtaletid |
| `vw_kartlegging_nokkeltall` | Nøkkeltall per kartlegging (langt format — enkelt å pivotere) |
| `vw_anbefalinger_rapport` | Hvilke tiltak som oftest foreslås på tvers av kunder |
| `vw_kundeemner_rapport` | Kundeemner fra Enhetsregisteret — funnel-oversikt |
| `vw_epost_rapport` | E-postutkast: opprettet, godkjent, sendt |

## 2. Koble Power BI Desktop til databasen

1. Åpne Power BI Desktop → **Hent data** → **PostgreSQL-database**
2. Server: samme host som `DATABASE_URL` i `.env` peker til
3. Database: samme databasenavn
4. Velg **DirectQuery** hvis du vil ha sanntidsdata, eller **Import** for raskere
   rapporter som oppdateres på et fast intervall
5. Velg de fem `vw_*`-visningene fra listen

## 3. Eksempler på rapporter å bygge

- **Salgstrakt:** antall leads per status (NY → KONTAKTET → MØTE BOOKET → TILBUD SENDT
  → VUNNET/TAPT) som et trakt- eller stolpediagram
- **Kundeemne-funnel:** foreslåtte → godkjente → konverterte kundeemner fra
  `vw_kundeemner_rapport`
- **Nøkkeltallsoversikt:** gjennomsnittlig personalkostnadsandel/svinnandel på tvers av
  alle kunder (kun til intern bruk — ALDRI del sammenligninger med enkeltkunder uten
  eksplisitt samtykke, jf. personvernreglene)
- **E-post-aktivitet:** hvor mange utkast som genereres vs. faktisk sendes, som et mål
  på "coworker"-modulens effektivitet

## 4. Når du er klar for å dele i skyen

Publiser fra Power BI Desktop til Power BI-tjenesten (krever Pro-lisens for deling).
Da kan du sette opp planlagt oppdatering slik at rapportene alltid viser ferske tall.

## Personvern

Rapporteringsvisningene inneholder virksomhetsnavn og nøkkeltall, men ikke
kontaktpersoners private opplysninger utover det som allerede er i `Lead`-tabellen.
Vurder å begrense tilgang til Power BI-arbeidsområdet til kun de som trenger det.
