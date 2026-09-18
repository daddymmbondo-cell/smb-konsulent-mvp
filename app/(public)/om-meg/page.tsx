import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Om meg" };

export default function OmMegPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="h-32 w-32 rounded-full bg-slate-100" aria-hidden />
        <h1 className="mt-6 text-3xl font-bold text-brand-dark">Om meg</h1>

        <div className="mt-8 space-y-8 text-slate-700">
          <section>
            <h2 className="font-semibold text-brand-dark">Bakgrunn</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Jeg har mer enn sju års ledererfaring som teamleder og kategoriansvarlig i dagligvare, kombinert
              med en mastergrad innen økonomi, strategi og ledelse. Jeg har stått i den daglige driften —
              bemanning, kundeservice, salg, vareflyt og resultatansvar — og vet hva som faktisk fungerer i
              praksis, ikke bare på papiret.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Arbeidsmetode</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Jeg starter alltid med en uforpliktende samtale for å forstå situasjonen din. Deretter en enkel
              kartlegging som gir et tydelig bilde av nøkkeltallene dine — med klart skille mellom det som er
              innrapportert, beregnet og estimert. Ut fra dette får du konkrete, prioriterte anbefalinger, ikke
              generiske råd.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Verdier</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>Realistisk og forsiktig språk — ingen løfter om garanterte resultater</li>
              <li>Tallene dine er dine — ingen deling med andre kunder uten samtykke</li>
              <li>Praktiske tiltak du faktisk kan gjennomføre, ikke bare teori</li>
            </ul>
          </section>
        </div>

        <Link
          href="/bestill-samtale"
          className="mt-10 inline-block rounded-xl bg-growth px-6 py-3 text-sm font-semibold text-white hover:bg-growth-light"
        >
          Bestill gratis kartleggingssamtale
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
