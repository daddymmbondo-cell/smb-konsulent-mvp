"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Draft = {
  id: string;
  subject: string;
  body: string;
  status: string;
  purpose: string;
  recipientName: string | null;
};

export function EmailDraftCard({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendMessage, setSendMessage] = useState<string | null>(null);

  async function act(action: "godkjenn" | "forkast") {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/email-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, subject, body }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(`Emne: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendNow() {
    if (!recipientEmail) {
      setSendMessage("Fyll inn mottakerens e-postadresse først.");
      return;
    }
    setBusy(true);
    setSendMessage(null);
    try {
      const res = await fetch(`/api/admin/email-drafts/${draft.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail }),
      });
      const responseBody = await res.json().catch(() => null);
      if (!res.ok) throw new Error(responseBody?.message ?? "Sending feilet.");
      setSendMessage(
        responseBody.sentVia === "microsoft-graph"
          ? "Sendt via Microsoft 365."
          : "Microsoft-integrasjonen er ikke koblet til ennå — sendingen ble kun logget lokalt (dev-modus), ikke faktisk sendt."
      );
      router.refresh();
    } catch (err) {
      setSendMessage(err instanceof Error ? err.message : "Ukjent feil.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {draft.purpose} {draft.recipientName && `— ${draft.recipientName}`}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              draft.status === "GODKJENT" ? "bg-growth/10 text-growth" : "bg-slate-100 text-slate-500"
            }`}
          >
            {draft.status === "GODKJENT" ? "Godkjent — klar for utsendelse" : "Utkast"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700">Emne</label>
        <input
          className="input mt-1"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={draft.status === "GODKJENT"}
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700">Innhold</label>
        <textarea
          rows={10}
          className="input mt-1 font-mono text-xs"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={draft.status === "GODKJENT"}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {draft.status === "UTKAST" && (
          <>
            <button
              onClick={() => act("godkjenn")}
              disabled={busy}
              className="rounded-xl bg-growth px-4 py-2 text-sm font-semibold text-white hover:bg-growth-light disabled:opacity-60"
            >
              Godkjenn
            </button>
            <button
              onClick={() => act("forkast")}
              disabled={busy}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-slate-50 disabled:opacity-60"
            >
              Forkast
            </button>
          </>
        )}
        <button
          onClick={copyToClipboard}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-slate-50"
        >
          {copied ? "Kopiert!" : "Kopier tekst"}
        </button>
      </div>

      {draft.status === "GODKJENT" && (
        <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
          <label className="block text-sm font-medium text-slate-700">
            Mottakerens e-postadresse
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              type="email"
              className="input flex-1"
              placeholder="navn@bedrift.no"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <button
              onClick={sendNow}
              disabled={busy}
              className="rounded-xl bg-growth px-4 py-2 text-sm font-semibold text-white hover:bg-growth-light disabled:opacity-60"
            >
              {busy ? "Sender..." : "Send nå"}
            </button>
          </div>
          {sendMessage && <p className="mt-2 text-xs text-slate-600">{sendMessage}</p>}
        </div>
      )}
    </div>
  );
}
