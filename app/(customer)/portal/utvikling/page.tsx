import Link from "next/link";
import { requireCustomerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { METRIC_META, METRIC_KEY_ORDER } from "@/lib/metrics/calculate";
import { MetricTrendChart, type TrendPoint } from "@/components/metric-trend-chart";

export const metadata = { title: "Utvikling over tid" };

export default async function UtviklingPage() {
  const { organization } = await requireCustomerSession();

  const assessments = await prisma.assessment.findMany({
    where: { organizationId: organization.id, status: "INNSENDT" },
    orderBy: { submittedAt: "asc" },
    include: { metrics: true },
  });

  if (assessments.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-brand-dark">Ingen utvikling å vise ennå</h1>
        <p className="mt-3 text-slate-600">
          Denne siden viser hvordan nøkkeltallene dine endrer seg fra kartlegging til kartlegging.
          Send inn minst to kartlegginger for å se en utvikling over tid.
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

  // Bygg én tidsserie per nøkkeltall, basert på de lagrede Metric-radene fra
  // hver innsendte kartlegging (beregnet og lagret på innsendingstidspunktet,
  // se app/api/kartlegging/[assessmentId]/route.ts).
  const seriesByKey: Record<string, TrendPoint[]> = {};
  for (const key of METRIC_KEY_ORDER) {
    seriesByKey[key] = assessments.map((a) => {
      const metric = a.metrics.find((m) => m.key === key);
      const date = a.submittedAt
        ? a.submittedAt.toLocaleDateString("nb-NO", { month: "short", year: "numeric" })
        : "—";
      return { date, value: metric?.value ?? null };
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Utvikling over tid</h1>
      <p className="mt-2 text-slate-600">
        Nøkkeltallene dine fra {assessments.length}{" "}
        {assessments.length === 1 ? "innsendt kartlegging" : "innsendte kartlegginger"}, side ved
        side.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRIC_KEY_ORDER.map((key) => (
          <MetricTrendChart
            key={key}
            label={METRIC_META[key].label}
            unit={METRIC_META[key].unit}
            points={seriesByKey[key]}
          />
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/portal/kartlegging"
          className="rounded-xl bg-growth px-5 py-2.5 text-sm font-semibold text-white hover:bg-growth-light"
        >
          Send inn en ny kartlegging
        </Link>
      </div>
    </main>
  );
}
