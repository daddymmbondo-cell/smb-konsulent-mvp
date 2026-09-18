# Sjekkliste før lansering

## Innhold
- [ ] Firmanavn satt i `lib/content/site.ts` (ikke lenger `[SETT INN FIRMANAVN]`)
- [ ] Priser satt i `lib/content/pricing.ts` (ikke lenger `[PRIS_...]`)
- [ ] Org.nr., e-post, telefon, adresse satt i `lib/content/site.ts`
- [ ] Personvernerklæring skrevet ferdig i `app/(public)/personvern/page.tsx`
  (er i dag kun en plassholder — bør gjennomgås av noen med kjennskap til
  GDPR/personopplysningsloven før reell bruk)
- [ ] "Om meg"-siden har riktig, faktisk innhold (ingen oppdiktede detaljer)
- [ ] Tjenestesidene i `lib/content/services.ts` stemmer med hva dere faktisk
  tilbyr

## Sikkerhet
- [ ] `AUTH_SECRET` i produksjon er NY og ulik dev-verdien
- [ ] Ekte adminbruker opprettet med `prisma/create-admin.ts` (IKKE
  seed-scriptet, som lager kjente testpassord)
- [ ] Seed-testbrukerne (`admin@eksempel-testdata.no`,
  `kunde@eksempel-testdata.no`) finnes IKKE i produksjonsdatabasen
- [ ] `npm audit` kjørt og gjennomgått — se egen note om Next.js-oppgradering
  under "Kjente begrensninger"
- [ ] Ingen hemmeligheter (`.env`) er committet til Git

## Funksjonstesting i produksjonsmiljøet
- [ ] Forsiden laster og ser riktig ut
- [ ] Kontaktskjema fungerer, lead havner i databasen
- [ ] Registrering og innlogging fungerer
- [ ] Kartlegging kan fylles ut og sendes inn
- [ ] Rapport genereres riktig
- [ ] Admin-innlogging og dashboard fungerer
- [ ] Alle E2E-tester kjørt mot produksjonslignende miljø (valgfritt, men
  anbefalt før første ekte kunde)

## E-post
- [ ] Bestemt hvilken e-posttjeneste som skal brukes (Resend/SMTP/M365) —
  foreløpig logger systemet kun lokalt, ingen ekte e-post sendes
- [ ] `ADMIN_EMAIL` satt til riktig adresse for leadvarsler

## SEO
- [ ] `NEXT_PUBLIC_SITE_URL` satt til riktig produksjons-URL (brukes av
  sitemap og robots.txt)
- [ ] Sjekk `/sitemap.xml` og `/robots.txt` fungerer i produksjon

## Kjente begrensninger (bevisst utsatt)
- Betaling/abonnement: kun forberedt med databasefelt, ingen ekte
  Stripe-integrasjon
- Microsoft 365/Power BI: krever egen appregistrering og testing før bruk
- Next.js har én kjent kritisk sårbarhet som krever en større versjonsoppgradering
  (14 → 16) — vurder dette som egen oppgave med grundig re-testing, ikke noe
  som gjøres i siste liten før lansering
- KI-funksjoner er forberedt i arkitekturen, men ikke aktivert

## Etter lansering
- [ ] Sett opp overvåking/varsling for nedetid (f.eks. Vercel sin innebygde,
  eller UptimeRobot)
- [ ] Avtal en fast rutine for å gjennomgå innkommende leads
- [ ] Vurder backup-rutiner for databasen (Neon har innebygd
  point-in-time-recovery på betalte planer)
