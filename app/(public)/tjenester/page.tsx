import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/lib/content/services";

export const metadata = { title: "Tjenester" };

export default function TjenesterPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-brand-dark">Tjenester</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Praktisk hjelp tilpasset norske butikker, dagligvarebutikker, kiosker, serveringssteder og
          franchisetakere.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/tjenester/${s.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand"
            >
              <h2 className="font-semibold text-brand-dark">{s.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{s.shortDescription}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand">Les mer →</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
