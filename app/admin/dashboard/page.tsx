import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { buildLeadFunnel, buildSuggestedLeadFunnel, calculateConversionRate } from "@/lib/dashboard/aggregate";
import { FunnelBarChart } from "@/components/funnel-bar-chart";

export const metadata = { title: "Dashboard — Administrator" };

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [leadStatusGroups, suggestedStatusGroups, totalLeads, wonLeads, assessmentsSubmitted, emailsSent] =
    await Promise.all([
      prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.suggestedLead.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "VUNNET" } }),
      prisma.assessment.count({ where: { status: "INNSENDT" } }),
      prisma.emailDraft.count({ where: { status: "SENDT" } }),
    ]);

  const leadFunnel = buildLeadFunnel(leadStatusGroups.map((g) => ({ status: g.status, count: g._count._all })));
  const suggestedFunnel = buildSuggestedLeadFunnel(
    suggestedStatusGroups.map((g) => ({ status: g.status, count: g._count._all }))
  );
  const conversionRate = calculateConversionRate(wonLeads, totalLeads);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-xs text-slate-400">
          For dypere analyse og deling: se <code className="rounded bg-slate-100 px-1.5 py-0.5">docs/power-bi-oppsett.md</code>
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <KpiCard label="Totalt antall leads" value={totalLeads} />
        <KpiCard label="Vunnet" value={wonLeads} />
        <KpiCard
          label="Konverteringsrate"
          value={conversionRate != null ? `${(conversionRate * 100).toFixed(0)} %` : "—"}
        />
        <KpiCard label="Innsendte kartlegginger" value={assessmentsSubmitted} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-brand-dark">Lead-status</h2>
          <div className="mt-4">
            <FunnelBarChart data={leadFunnel} color="#16406B" />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-brand-dark">Kundeemner (fra Enhetsregisteret)</h2>
          <div className="mt-4">
            <FunnelBarChart data={suggestedFunnel} color="#1E8A5F" />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-brand-dark">Coworker-aktivitet</h2>
        <p className="mt-2 text-sm text-slate-600">
          {emailsSent} e-post{emailsSent === 1 ? "" : "er"} sendt (etter admin-godkjenning).
        </p>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-brand-dark">{value}</p>
    </div>
  );
}
