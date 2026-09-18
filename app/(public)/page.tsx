import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ForsidePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-brand-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Få bedre kontroll på driften og et tydeligere bilde av hvor bedriften din kan bli mer lønnsom.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">
              Vi hjelper norske butikker, dagligvarebutikker, kiosker, serveringssteder og franchisetakere med
              bemanning, kostnadskontroll og bedre rutiner — basert på en enkel kartlegging av din virksomhet.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/bestill-samtale"
                className="rounded-xl bg-growth px-6 py-3 text-base font-semibold text-white hover:bg-growth-light"
              >
                Bestill gratis kartleggingssamtale
              </Link>
              <Link
                href="#slik-fungerer-det"
                className="rounded-xl border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
              >
                Se hvordan det fungerer
              </Link>
            </div>
          </div>
        </section>

        {/* Fordeler */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-brand-dark">Hva du får</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Tydelig oversikt",
                text: "Se dine viktigste nøkkeltall samlet, med tydelig skille mellom faktiske tall og estimater.",
              },
              {
                title: "Konkrete tiltak",
                text: "Få prioriterte, konkrete forbedringsforslag — ikke bare tall.",
              },
              {
                title: "Praktisk erfaring",
                text: "Bygget på mer enn sju års reell ledererfaring fra daglig drift i dagligvare.",
              },
              {
                title: "Ingen bindingstid i starten",
                text: "Start med en uforpliktende kartleggingssamtale, helt gratis.",
              },
              {
                title: "Trygg håndtering av data",
                text: "Dine tall knyttes kun til din virksomhet og deles aldri med andre kunder.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-brand-dark">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Slik fungerer det */}
        <section id="slik-fungerer-det" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-brand-dark">Slik fungerer det</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "1", title: "Ta kontakt", text: "Fyll ut kontaktskjemaet eller book en samtale direkte." },
                { step: "2", title: "Kartleggingssamtale", text: "Vi tar en uforpliktende samtale om situasjonen din." },
                { step: "3", title: "Kartlegging", text: "Du fyller ut en enkel kartlegging i kundeportalen, i eget tempo." },
                { step: "4", title: "Rapport og oppfølging", text: "Du får en oversiktlig rapport med konkrete, prioriterte tiltak." },
              ].map((s) => (
                <li key={s.step} className="rounded-xl border border-slate-200 p-6">
                  <span className="text-sm font-bold text-growth">Steg {s.step}</span>
                  <h3 className="mt-2 font-semibold text-brand-dark">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Om meg - kort */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-8 sm:flex sm:items-center sm:gap-8">
            <div className="h-32 w-32 shrink-0 rounded-full bg-slate-100" aria-hidden />
            <div className="mt-6 sm:mt-0">
              <h2 className="text-xl font-semibold text-brand-dark">Om meg</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Jeg har mer enn sju års ledererfaring fra daglig drift i dagligvare, kombinert med en
                mastergrad innen økonomi, strategi og ledelse. Jeg vet hva som skal til i praksis — ikke bare
                på papiret.
              </p>
              <Link href="/om-meg" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
                Les mer om meg →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-brand-dark">Ofte stilte spørsmål</h2>
            <div className="mt-8 space-y-4">
              {[
                {
                  q: "Koster kartleggingssamtalen noe?",
                  a: "Nei, den første samtalen er uforpliktende og gratis.",
                },
                {
                  q: "Hvor lang tid tar kartleggingen?",
                  a: "De fleste bruker mellom 20 og 40 minutter, og du kan lagre underveis og fortsette senere.",
                },
                {
                  q: "Hva skjer med tallene mine?",
                  a: "Tallene dine knyttes kun til din virksomhet og brukes ikke i sammenligning med eller deling til andre kunder.",
                },
              ].map((f) => (
                <details key={f.q} className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer font-medium text-brand-dark">{f.q}</summary>
                  <p className="mt-2 text-sm text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-brand-dark">Klar for å ta første steg?</h2>
          <Link
            href="/bestill-samtale"
            className="mt-6 inline-block rounded-xl bg-growth px-6 py-3 text-base font-semibold text-white hover:bg-growth-light"
          >
            Bestill gratis kartleggingssamtale
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
