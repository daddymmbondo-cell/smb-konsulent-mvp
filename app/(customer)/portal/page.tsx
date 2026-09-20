import Link from "next/link";
import { requireCustomerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { calculateAllMetrics } from "@/lib/metrics/calculate";

export const metadata = { title: "Min oversikt" };

export default async function PortalPage() {
  const { organization } = await requireCustomerSession();

  const latestAssessment = await prisma.assessment.findFirst({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "desc" },
    include: { answers: true, recommendations: true },
  });

  const metrics = latestAssessment?.answers ? calculateAllMetrics(latestAssessment.answers) : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Hei, {organization.name}</h1>
      <p className="mt-2 text-slate-600">Her er oversikten din.</p>

      {!latestAssessment && (
        <div className="mt-8 rounded-xl border border-brand/20 bg-brand/5 p-6">
          <h2 className="font-semibold text-brand-dark">Neste steg: fyll ut kartleggingen</h2>
          <p className="mt-1 text-sm text-slate-600">
            Kartleggingen tar 20–40 minutter og kan lagres underveis. Den gir grunnlaget for dashboardet og
            rapporten din.
          </p>
          <Link
            href="/portal/kartlegging"
            className="mt-4 inline-block rounded-xl bg-growth px-5 py-2.5 text-sm font-semibold text-white hover:bg-growth-light"
          >
            Start kartlegging
          </Link>
        </div>
      )}

      {latestAssessment && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark">Nøkkeltall</h2>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Status: {latestAssessment.status === "INNSENDT" ? "Innsendt" : "Utkast"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.key} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold text-brand-dark">
                  {m.value != null
                    ? m.unit === "%"
                      ? `${(m.value * 100).toFixed(1)} %`
                      : `${Math.round(m.value).toLocaleString("nb-NO")} kr`
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {m.isEstimate ? "Estimat — datagrunnlag ufullstendig" : "Basert på innrapporterte tall"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {latestAssessment.status === "UTKAST" && (
              <Link
                href="/portal/kartlegging"
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light"
              >
                Fortsett kartleggingen
              </Link>
            )}
            <Link
              href="/portal/rapport"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-slate-50"
            >
              Se full rapport
            </Link>
            {latestAssessment.status === "INNSENDT" && (
              <Link
                href="/portal/kartlegging"
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-slate-50"
              >
                Start ny kartlegging
              </Link>
            )}
            <Link
              href="/portal/utvikling"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-slate-50"
            >
              Se utvikling over tid
            </Link>
          </div>

          {latestAssessment.recommendations.length > 0 && (
            <div className="mt-10">
              <h2 className="font-semibold text-brand-dark">Prioriterte anbefalinger</h2>
              <ul className="mt-4 space-y-3">
                {latestAssessment.recommendations
                  .sort((a, b) => a.priority - b.priority)
                  .slice(0, 3)
                  .map((r) => (
                    <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="font-medium text-brand-dark">{r.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{r.action}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}
    </main>
  );
}
