# CLAUDE.md — Instruksjoner for videre arbeid på dette prosjektet

Dette dokumentet er kontekst for Claude (eller andre AI-assistenter) som jobber videre på kodebasen.

## Formål
Produksjonsklar MVP for en konsulentplattform rettet mot norske SMB-er (butikker, dagligvare, kiosk, servering, franchise). Se `docs/product-requirements.md` for full kravspesifikasjon.

## Faste regler (aldri brytes uten eksplisitt godkjenning fra eier)
- Ikke slett data eller kode uten å spørre først.
- Ikke publiser/deploy uten eksplisitt godkjenning.
- Ikke opprett eller bruk ekte kontoer.
- Ikke send ekte e-poster — bruk dev-adapter som logger lokalt.
- Ikke gjennomfør ekte betalinger — Stripe er kun forberedt, ikke aktivert.
- Ikke bruk ekte personopplysninger i testdata.
- Ikke legg hemmeligheter i kode, Git eller logger — bruk `.env` (aldri commit).
- Ikke finn på kundecaser, sertifiseringer eller økonomiske resultater.
- Ikke bruk juridisk/skattemessig/regnskapsmessig språk som kan tolkes som autoritativ rådgivning.
- Ikke koble BankID, Altinn, bank, regnskapssystem eller betaling uten eksplisitt godkjenning.
- Stopp og spør ved beslutninger som kan gi økonomisk tap, personvernrisiko eller irreversibel endring.

## Arbeidsmåte
1. Vis alltid hvilke filer som er endret.
2. Oppsummer tester og eventuelle feil etter hver fase.
3. Kjør format → lint → typecheck → unit-tester → build → e2e-tester etter hver større milepæl.
4. Ikke merk en oppgave som ferdig før den er testet.
5. Hvis noe ikke kan gjennomføres — forklar hvorfor og foreslå trygt alternativ.

## Teknologistack
Next.js (App Router) + TypeScript, Tailwind + shadcn/ui, PostgreSQL + Prisma, Auth.js, Zod, React Hook Form, Recharts, Vitest, Playwright, Docker (lokal db).

## Språk
UI: norsk bokmål. Kode/variabelnavn/teknisk dokumentasjon: engelsk.

## Datamodell-prinsipp
All kundedata kobles til `Organization`, aldri direkte til `User` alene — dette hindrer kryss-tilgang mellom kunder og støtter flere brukere per bedrift.

## KI-funksjoner
Ikke aktivert i MVP. Når de bygges: regelbasert først, KI-abstraksjon klar for Anthropic API senere, med bryter for av/på, sporbarhet, og forbud mot å blande data mellom kunder.
