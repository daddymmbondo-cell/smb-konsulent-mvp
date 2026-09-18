import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadForm } from "@/components/lead-form";

export const metadata = { title: "Kontakt" };

export default function KontaktPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-brand-dark">Kontakt oss</h1>
        <p className="mt-3 text-slate-600">
          Fortell oss litt om virksomheten din, så tar vi kontakt for en uforpliktende prat.
        </p>
        <div className="mt-8">
          <LeadForm variant="kontakt" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
