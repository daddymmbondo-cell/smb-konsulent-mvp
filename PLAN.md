# PLAN.md — Konsulentplattform for norske SMB-er

Status: Fase 1 — Analyse og plan (ikke godkjent, ingen kode skrevet)

## 1. Prosjektstatus

Prosjektmappen er tom — dette er et nytt prosjekt fra bunnen av. Ingen eksisterende kode, database, design eller miljøvariabler funnet.

## 2. Valgt teknologistack

Følger spesifikasjonens standardvalg (lavrisiko, dokumenteres her):

| Lag | Valg |
|---|---|
| Rammeverk | Next.js 14+ (App Router), TypeScript |
| Styling/UI | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Autentisering | Auth.js (NextAuth) med credentials + hashed passord (argon2/bcrypt) |
| Validering | Zod |
| Skjemaer | React Hook Form + Zod resolver |
| Grafer | Recharts |
| Enhetstester | Vitest |
| E2E-tester | Playwright |
| Lokal database | Docker Compose (Postgres) |
| E-post | Adaptermønster — dev-adapter (logger lokalt) → Resend senere |
| KI | Serviceabstraksjon — ikke koblet til i MVP |
| Deployment | Vercel-kompatibel (frontend) + hostet Postgres (f.eks. Neon/Supabase senere) |

## 3. Arkitektur (høynivå)

```
apps/web (Next.js, App Router)
 ├─ app/(public)/          → forside, tjenester, om, priser, kontakt
 ├─ app/(auth)/             → registrering, innlogging
 ├─ app/(customer)/         → kundeportal, kartlegging, dashboard, rapport
 ├─ app/(admin)/            → administratorpanel
 ├─ app/api/…                → server actions / route handlers
 ├─ lib/
 │   ├─ email/               → adaptermønster (dev-adapter først)
 │   ├─ ai/                  → serviceabstraksjon (av som standard)
 │   ├─ metrics/             → nøkkeltallsberegninger (rene funksjoner, testbare)
 │   └─ recommendations/     → regelbasert anbefalingsmotor
 ├─ prisma/
 │   ├─ schema.prisma
 │   ├─ migrations/
 │   └─ seed.ts
 └─ tests/
     ├─ unit/
     └─ e2e/
```

Tilgangskontroll skjer alltid på serversiden (ikke bare i UI), og all kundedata knyttes til `Organization`-id for å hindre kryss-tilgang mellom kunder.

## 4. Database — foreløpig modell

`User, Organization, OrganizationMember, Lead, Assessment, AssessmentAnswer, Metric, Recommendation, CustomerTask, Message, Document, AuditLog, ConsentRecord, Booking, Notification`

Nøkkelprinsipp: alt som tilhører en kunde henger på `Organization`, ikke direkte på `User` — dette støtter fremtidig multi-bruker per bedrift.

## 5. Sidekart

**Offentlig:** Forside, Tjenester (6 undersider), Om meg, Priser, Kontakt
**Kunde:** Onboarding, Kartlegging (6 deler, trinnvis), Dashboard, Rapport, Anbefalinger, Meldinger, Profil
**Admin:** Leads, Kunder, Kartleggingsresultater, Anbefalinger, Notater, Eksport, Audit-logg

## 6. Brukerroller

Besøkende (offentlig + skjema) → Kunde (portal, kartlegging, dashboard) → Administrator (full oversikt, ingen kryss-tilgang mellom organisasjoner uten eksplisitt tilgang)

## 7. Sikkerhet

- Zod-validering server-side på alle innganger, avvis ukjente felter
- Rate-limiting på offentlige skjemaer (kontakt, lead, registrering)
- Ingen rå passord, ingen hemmeligheter i kode/Git/logger
- Audit-logg på sikkerhetsrelevante hendelser
- Ingen BankID/Altinn/bank/regnskap/betaling uten eksplisitt godkjenning

## 8. Teststrategi

Vitest for nøkkeltallsberegning, validering, anbefalingsmotor. Playwright for kritiske flyter (lead-innsending, kartlegging, dashboard, admin-tilgangskontroll). Kjøres etter hver milepæl: format → lint → typecheck → unit → build → e2e.

## 9. Deployment

Vercel for app-laget; hostet Postgres. Ingen publisering uten eksplisitt godkjenning fra deg.

## 10. Milepælsplan (faser 1–7 som beskrevet i oppdraget)

Fase 1 (nå) → Fase 2 Grunnstruktur → Fase 3 Offentlig nettsted → Fase 4 Kundeportal → Fase 5 Adminpanel → Fase 6 Kvalitet → Fase 7 Deployment-klargjøring

## 11. Usikkerheter / ting jeg trenger fra deg

Se egen seksjon nederst i chat-svaret ("Spørsmål jeg må besvare").
