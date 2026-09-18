import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { LeadStatusSelect } from "@/components/lead-status-select";
import { BookingConfirm } from "@/components/booking-confirm";

export const metadata = { title: "Leads — Administrator" };

export default async function AdminLeadsPage() {
  await requireAdminSession();

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { booking: true },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Leads</h1>
      <p className="mt-2 text-sm text-slate-600">Følg opp henvendelser og book kartleggingssamtaler.</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Navn / Virksomhet</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Ønsket tidspunkt</th>
              <th className="px-4 py-3">Mottatt</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-dark">{lead.name}</p>
                  <p className="text-slate-500">{lead.businessName}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{lead.email}</p>
                  <p>{lead.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {lead.booking ? (
                    lead.booking.confirmedTime ? (
                      <p>
                        Bekreftet:{" "}
                        {lead.booking.confirmedTime.toLocaleString("nb-NO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    ) : (
                      <BookingConfirm bookingId={lead.booking.id} preferredTime={lead.booking.preferredTime} />
                    )
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {lead.createdAt.toLocaleDateString("nb-NO")}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Ingen leads ennå.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
