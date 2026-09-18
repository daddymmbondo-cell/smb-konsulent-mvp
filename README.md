# [SETT INN FIRMANAVN] — Konsulentplattform

Webplattform for konsulentvirksomhet rettet mot norske SMB-er: leadfangst, booking, kundeportal med lønnsomhetskartlegging, resultatdashboard og administratorpanel.

> **Status:** Planleggingsfase. Ingen kode er skrevet ennå — se `PLAN.md` og `docs/product-requirements.md`.

## Teknologistack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Auth.js
- Zod, React Hook Form, Recharts
- Vitest (enhetstester), Playwright (e2e)

## Kom i gang (når koden er på plass)
```bash
# 1. Installer avhengigheter
npm install

# 2. Start lokal database
docker compose up -d

# 3. Kopier miljøvariabler
cp .env.example .env
# Fyll inn DATABASE_URL, AUTH_SECRET, osv.

# 4. Kjør migrasjoner og seed
npx prisma migrate dev
npx prisma db seed

# 5. Start utviklingsserver
npm run dev
```

## Testing

```bash
# Enhetstester (rene funksjoner — nøkkeltall, anbefalinger, ukeplan, dashboard)
npm run test

# Ende-til-ende-tester (krever at databasen er satt opp og seedet, se over)
npx playwright install chromium   # kun første gang
npm run test:e2e

# E2E med visuelt grensesnitt for feilsøking
npm run test:e2e:ui
```

E2E-testene dekker: forsiden, kontakt-/bestill samtale-skjemaene, hele kundeflyten
(registrering → kartlegging → rapport), adminflyten (dashboard, leads) og
tilgangskontroll (at kunder ikke kommer inn på adminsider, og uinnloggede ikke
kommer inn på kundeportalen).

E2E-testdata (identifisert på e-postdomenet `@e2e-test.no`) ryddes automatisk
bort etter hver testkjøring. Har du kjørt tester tidligere og ser gamle
"E2E ..."-rader i lead-listen eller dashboardet, kjør opprydningen manuelt:
```bash
npm run cleanup:e2e-data
```



## Prosjektstruktur
Se `docs/architecture.md` for full oversikt over mappestruktur, sidekart og datamodell.

## Dokumentasjon
- `PLAN.md` — teknisk plan og milepæler
- `CLAUDE.md` — arbeidsregler for AI-assistert utvikling
- `docs/product-requirements.md` — full kravspesifikasjon
- `docs/architecture.md` — arkitektur og datamodell

## Viktig
Ingen ekte e-poster sendes, ingen ekte betalinger gjennomføres, og ingen publisering skjer uten eksplisitt godkjenning fra eier i MVP-fasen.
