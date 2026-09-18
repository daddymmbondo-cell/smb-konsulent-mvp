import { requireAdminSession } from "@/lib/session";
import { isMicrosoftIntegrationEnabled } from "@/lib/graph/client";
import { listRecentInboxMessages } from "@/lib/graph/calendar";
import type { GraphMailMessage } from "@/lib/graph/calendar";
import { InboxMessageRow } from "@/components/inbox-message-row";

export const metadata = { title: "Innboks — Administrator" };

export default async function InnboksPage() {
  await requireAdminSession();

  if (!isMicrosoftIntegrationEnabled()) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-brand-dark">Innboks</h1>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Microsoft 365-integrasjonen er ikke koblet til ennå. Fyll inn
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">AZURE_AD_CLIENT_ID</code>,
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">AZURE_AD_CLIENT_SECRET</code>,
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">AZURE_AD_TENANT_ID</code> og
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">MICROSOFT_MAILBOX_ADDRESS</code>
          i <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env</code>, og sett{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">MICROSOFT_INTEGRATION_ENABLED=&quot;true&quot;</code>.
        </div>
      </main>
    );
  }

  let messages: GraphMailMessage[];
  let errorMessage: string | null = null;
  try {
    messages = await listRecentInboxMessages(20);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Ukjent feil ved henting av innboks.";
    messages = [];
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-brand-dark">Innboks</h1>
      <p className="mt-2 text-sm text-slate-600">
        Kun lesing herfra — generer et svarutkast, som deretter må gjennomgås og godkjennes under
        «E-postutkast» før det sendes.
      </p>

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>
      )}

      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <InboxMessageRow key={m.id} message={m} />
        ))}
        {messages.length === 0 && !errorMessage && (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-400">
            Ingen meldinger funnet.
          </p>
        )}
      </div>
    </main>
  );
}
