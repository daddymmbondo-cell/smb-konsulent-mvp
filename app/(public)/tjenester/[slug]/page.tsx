import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services, getServiceBySlug } from "@/lib/content/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  return { title: service?.title ?? "Tjeneste" };
}

export default function TjenestePage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/tjenester" className="text-sm text-brand hover:underline">
          ← Alle tjenester
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-brand-dark">{service.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{service.shortDescription}</p>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="font-semibold text-brand-dark">Hvem passer dette for?</h2>
            <p className="mt-2 text-sm text-slate-600">{service.targetAudience}</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-dark">Hvilket problem løser det?</h2>
            <p className="mt-2 text-sm text-slate-600">{service.problem}</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-dark">Hva inngår?</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {service.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-semibold text-brand-dark">Forventet leveranse</h2>
              <p className="mt-2 text-sm text-slate-600">{service.deliverable}</p>
            </div>
            <div>
              <h2 className="font-semibold text-brand-dark">Typisk tidsramme</h2>
              <p className="mt-2 text-sm text-slate-600">{service.timeframe}</p>
            </div>
          </div>
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
