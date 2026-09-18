# Deployment-guide — Vercel + Neon

Du bruker allerede Neon til lokal utvikling, så produksjonsoppsettet er en
naturlig forlengelse: samme database (eller et eget produksjons-prosjekt i
Neon, anbefalt), pluss Vercel for selve applikasjonen.

## 1. Forbered databasen for produksjon

**Anbefalt:** opprett et NYTT Neon-prosjekt for produksjon, adskilt fra
utviklingsdatabasen din. Da kan du eksperimentere lokalt uten å påvirke ekte
kundedata senere.

1. Gå til [neon.tech](https://neon.tech) → **Create a project** → gi det et
   navn som skiller det fra dev, f.eks. «smb-konsulent-produksjon»
2. Neon viser deg to tilkoblingsstrenger under **Connection Details** —
   du trenger begge:
   - **Pooled connection** (host inneholder `-pooler`) → dette er
     `DATABASE_URL`, brukes av selve appen i Vercels serverless-miljø
   - **Direct connection** (uten `-pooler`) → dette er `DIRECT_URL`,
     brukes kun av `prisma migrate deploy` i steg 5 (migreringer fungerer
     ikke pålitelig gjennom pooleren)
   - Begge skal ha `?sslmode=require` til slutt (Neon krever SSL) — dette
     ligger normalt med i strengen Neon gir deg som standard

## 2. Push koden til GitHub

Vercel deployer fra et Git-repository. Har du ikke gjort dette ennå:

```bash
git init
git add .
git commit -m "Første versjon"
```

Opprett et nytt, **privat** repository på [github.com](https://github.com/new),
og følg instruksjonene GitHub gir deg for å pushe koden dit.

> Sjekk at `.env` IKKE følger med (den skal stå i `.gitignore`) — den
> inneholder hemmeligheter. Kjør gjerne `git status` rett før `git add .`
> og se etter at `.env` ikke dukker opp i listen.

## 3. Koble til Vercel

1. Gå til [vercel.com](https://vercel.com) → logg inn med GitHub-kontoen din
2. **Add New** → **Project** → velg repositoriet ditt
3. Vercel gjenkjenner automatisk at det er et Next.js-prosjekt — ikke endre
   byggeinnstillingene

## 4. Sett miljøvariabler i Vercel

Under prosjektets **Settings → Environment Variables**, legg inn (samme
navn som i `.env`, men med produksjonsverdier):

| Variabel | Verdi |
|---|---|
| `DATABASE_URL` | Neons **poolede** tilkoblingsstreng fra steg 1 (host med `-pooler`) |
| `DIRECT_URL` | Neons **direkte** tilkoblingsstreng fra steg 1 (host uten `-pooler`) — brukes kun til migrasjoner |
| `AUTH_SECRET` | En NY, egen hemmelighet (ikke gjenbruk dev-verdien) — generer med `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXTAUTH_URL` | Den faktiske produksjons-URL-en (Vercel gir deg en `.vercel.app`-adresse automatisk, eller ditt eget domene) |
| `ADMIN_EMAIL` | E-postadressen som skal motta leadvarsler |
| `AI_FEATURES_ENABLED` | `false` (inntil videre) |
| `MICROSOFT_INTEGRATION_ENABLED` | `false` (inntil du har testet den ferdig) |
| `NEXT_PUBLIC_SITE_URL` | Samme som `NEXTAUTH_URL` — brukes til sitemap/SEO |

## 5. Kjør databasemigrasjoner mot produksjonsdatabasen

Fra din lokale maskin, med `DATABASE_URL` og `DIRECT_URL` midlertidig
pekende til produksjonsdatabasen (eller via Vercel sin CLI):

```bash
# Sett DATABASE_URL og DIRECT_URL til produksjonslenkene i terminalen din
# midlertidig (f.eks. i en .env.production.local som IKKE committes), deretter:
npx prisma migrate deploy
```

`migrate deploy` bruker `directUrl` fra `schema.prisma` (altså `DIRECT_URL`)
til selve migreringen — det er derfor begge variablene må være satt, ikke
bare `DATABASE_URL`.

**Ikke** kjør `npm run prisma:seed` mot produksjon — det oppretter testbrukere
med kjente passord, som er en sikkerhetsrisiko i en ekte, offentlig database.
Opprett heller en ekte adminbruker manuelt (se eget script-forslag i
sjekklisten).

## 6. Deploy

Trykk **Deploy** i Vercel. Første bygg tar noen minutter. Vercel gir deg en
URL på formen `dittprosjekt.vercel.app`.

## 7. (Valgfritt) Koble til eget domene

Under **Settings → Domains** i Vercel, legg til domenet ditt og følg
instruksjonene for DNS-oppsett hos din domeneleverandør.

## 8. Verifiser

- Besøk forsiden — laster den?
- Test kontaktskjemaet — kommer leadet inn i databasen?
- Logg inn som admin (etter at du har opprettet en ekte adminbruker, se
  sjekklisten) — fungerer dashboardet?

## Løpende drift

- Vercel bygger automatisk på nytt hver gang du pusher til hovedgrenen på
  GitHub
- Nye databaseendringer: kjør `npx prisma migrate deploy` mot
  produksjonsdatabasen etter at migrasjonen er testet lokalt
