import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateWeekPlan } from "@/lib/leads/week-plan";

export const metadata = { title: "Ukeplan — Administrator" };

export default async function UkeplanPage() {
  await requireAdminSession();

  const [newLeadsCount, approvedSuggestionsWithoutDraft, approvedEmailDraftsReadyToSend, assessmentsAwaitingReport, bookingsWithoutConfirmedTime] =
    await Promise.all([
      prisma.lead.count({ where: { status: "NY" } }),
      prisma.suggestedLead.count({ where: { status: "GODKJENT", emailDrafts: { none: {} } } }),
      prisma.emailDraft.count({ where: { status: "GODKJENT" } }),
      prisma.assessment.count({
        where: { status: "INNSENDT", submittedAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.booking.count({ where: { confirmedTime: null } }),
    ]);

  const plan = generateWeekPlan({
    newLeadsCount,
    approvedSuggestionsWithoutDraft,
    approvedEmailDraftsReadyToSend,
    assessmentsAwaitingReport,
    bookingsWithoutConfirmedTime,
  });

  const days: Array<typeof plan[number]["day"]> = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Ukeplan</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Regelbasert forslag basert på det som faktisk står åpent i systemet akkurat nå — ingen oppdiktede
        oppgaver.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-5">
        {days.map((day) => {
          const dayItems = plan.filter((i) => i.day === day);
          return (
            <div key={day} className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="font-semibold text-brand-dark">{day}</h2>
              <div className="mt-3 space-y-3">
                {dayItems.length === 0 && <p className="text-xs text-slate-400">Ingen forslag</p>}
                {dayItems.map((item, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs font-medium text-slate-700">{item.task}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
