import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadForm } from "@/components/lead-form";

export const metadata = { title: "Bestill gratis kartleggingssamtale" };

export default function BestillSamtalePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-brand-dark">Bestill gratis kartleggingssamtale</h1>
        <p className="mt-3 text-slate-600">
          Fyll ut skjemaet, så tar vi kontakt for å avtale et passende tidspunkt for en uforpliktende samtale
          om driften din.
        </p>
        <div className="mt-8">
          <LeadForm variant="bestill-samtale" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
