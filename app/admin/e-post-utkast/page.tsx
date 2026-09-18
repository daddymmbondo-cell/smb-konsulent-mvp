import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EmailDraftCard } from "@/components/email-draft-card";

export const metadata = { title: "E-postutkast — Administrator" };

export default async function EmailDraftsPage() {
  await requireAdminSession();

  const drafts = await prisma.emailDraft.findMany({
    where: { status: { in: ["UTKAST", "GODKJENT"] } },
    orderBy: { createdAt: "desc" },
    include: { suggestedLead: true },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">E-postutkast</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Alle utkast er generert av systemet og er <strong>ikke sendt</strong>. Les gjennom, rediger ved behov,
        og godkjenn. Foreløpig må godkjente e-poster sendes manuelt (kopier teksten inn i din e-postklient) —
        automatisk utsendelse via Microsoft 365 kommer når kontoen er koblet til.
      </p>

      <div className="mt-8 space-y-6">
        {drafts.map((draft) => (
          <EmailDraftCard
            key={draft.id}
            draft={{
              id: draft.id,
              subject: draft.subject,
              body: draft.body,
              status: draft.status,
              purpose: draft.purpose,
              recipientName: draft.suggestedLead?.name ?? null,
            }}
          />
        ))}
        {drafts.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-400">
            Ingen ventende e-postutkast. Gå til «Foreslåtte kundeemner» for å opprette utkast.
          </p>
        )}
      </div>
    </main>
  );
}
