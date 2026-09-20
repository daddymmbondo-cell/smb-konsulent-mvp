import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pricingPackages } from "@/lib/content/pricing";

export const metadata = { title: "Priser" };

export default function PriserPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-brand-dark">Priser</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Tre måter å komme i gang på. Priser fastsettes ut fra virksomhetens størrelse og behov —
          ta kontakt for et konkret tilbud.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {pricingPackages.map((pkg) => (
            <div key={pkg.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-brand-dark">{pkg.title}</h2>
              <p className="mt-2 text-2xl font-bold text-brand-dark">{pkg.price}</p>
              <p className="mt-2 text-sm text-slate-600">{pkg.description}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {pkg.included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-growth">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/bestill-samtale"
                className="mt-6 rounded-xl bg-growth px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-growth-light"
              >
                {pkg.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
