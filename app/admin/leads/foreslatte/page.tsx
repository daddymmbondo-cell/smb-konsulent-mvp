import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { RELEVANT_NACE_CODES } from "@/lib/leads/bronnoyund";
import { LeadSearchForm } from "@/components/lead-search-form";
import { SuggestedLeadRow } from "@/components/suggested-lead-row";

export const metadata = { title: "Foreslåtte kundeemner — Administrator" };

export default async function ForeslatteLeadsPage() {
  await requireAdminSession();

  const suggestions = await prisma.suggestedLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Foreslåtte kundeemner</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Hentet fra Enhetsregisteret (Brønnøysundregistrene) — et åpent, offentlig register. Dette gir kun
        virksomhetsdata, ikke kontaktinfo eller samtykke til markedsføring. Vurder hvert emne før du
        godkjenner det, og husk at kontaktinfo må skaffes og markedsføringslovens krav vurderes før kontakt.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-brand-dark">Nytt søk</h2>
        <LeadSearchForm naceCodes={RELEVANT_NACE_CODES} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Virksomhet</th>
              <th className="px-4 py-3">Bransje</th>
              <th className="px-4 py-3">Kommune</th>
              <th className="px-4 py-3">Ansatte</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Handling</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s) => (
              <SuggestedLeadRow key={s.id} suggestion={s} />
            ))}
            {suggestions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Ingen forslag ennå. Bruk søket over.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
