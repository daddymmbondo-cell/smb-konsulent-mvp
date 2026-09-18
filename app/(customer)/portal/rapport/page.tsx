import Link from "next/link";
import { requireCustomerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { calculateAllMetrics } from "@/lib/metrics/calculate";
import { PrintButton } from "@/components/print-button";

export const metadata = { title: "Rapport" };

export default async function RapportPage() {
  const { organization } = await requireCustomerSession();

  const assessment = await prisma.assessment.findFirst({
    where: { organizationId: organization.id, status: "INNSENDT" },
    orderBy: { submittedAt: "desc" },
    include: { answers: true, recommendations: { orderBy: { priority: "asc" } } },
  });

  if (!assessment || !assessment.answers) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-brand-dark">Ingen rapport ennå</h1>
        <p className="mt-3 text-slate-600">
          Du må fullføre og sende inn kartleggingen før rapporten kan vises.
        </p>
        <Link
          href="/portal/kartlegging"
          className="mt-6 inline-block rounded-xl bg-growth px-5 py-2.5 text-sm font-semibold text-white hover:bg-growth-light"
        >
          Gå til kartlegging
        </Link>
      </main>
    );
  }

  const metrics = calculateAllMetrics(assessment.answers);
  const top3 = assessment.recommendations.slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Rapport for {organization.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {assessment.submittedAt?.toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <PrintButton />
      </div>

      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        Denne rapporten er rådgivende og bygger på tall du selv har rapportert inn. Den erstatter ikke
        regnskapsmessig, skattemessig eller juridisk rådgivning.
      </p>

      <section className="mt-8">
        <h2 className="font-semibold text-brand-dark">Nøkkeltall</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {metrics.map((m) => (
            <div key={m.key} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{m.label}</p>
              <p className="mt-1 text-xl font-semibold text-brand-dark">
                {m.value != null
                  ? m.unit === "%"
                    ? `${(m.value * 100).toFixed(1)} %`
                    : `${Math.round(m.value).toLocaleString("nb-NO")} kr`
                  : "Mangler data"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {m.isEstimate ? `Estimat${m.missingInputs.length ? ` — mangler: ${m.missingInputs.join(", ")}` : ""}` : "Beregnet fra innrapporterte tall"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-brand-dark">Tre prioriterte tiltak</h2>
        <ol className="mt-3 space-y-4">
          {top3.map((r, i) => (
            <li key={r.id} className="rounded-xl border border-slate-200 p-4">
              <span className="text-xs font-bold text-growth">Tiltak {i + 1}</span>
              <h3 className="mt-1 font-semibold text-brand-dark">{r.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{r.problem}</p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-medium">Anbefalt tiltak: </span>
                {r.action}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-medium">Første steg: </span>
                {r.firstStep}
              </p>
            </li>
          ))}
          {top3.length === 0 && (
            <p className="text-sm text-slate-500">
              Ingen spesifikke anbefalinger ble utløst av innrapporterte tall denne gangen.
            </p>
          )}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-brand-dark">Videre oppfølging</h2>
        <p className="mt-2 text-sm text-slate-600">
          30-dagers plan: start med tiltak 1 over. 90-dagers plan: følg opp alle tre tiltakene og bestill en
          oppfølgingssamtale for å vurdere fremgang.
        </p>
        <Link
          href="/bestill-samtale"
          className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light print:hidden"
        >
          Bestill oppfølgingssamtale
        </Link>
      </section>
    </main>
  );
}
