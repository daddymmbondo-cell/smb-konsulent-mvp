"use client";

import { useState } from "react";

type Message = {
  id: string;
  subject: string;
  from?: { emailAddress?: { name?: string; address?: string } };
  bodyPreview: string;
  receivedDateTime: string;
  isRead: boolean;
};

export function InboxMessageRow({ message }: { message: Message }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function generateReply() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/admin/inbox/draft-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: message.subject,
          senderName: message.from?.emailAddress?.name,
          summary: message.bodyPreview.slice(0, 200),
        }),
      });
      if (!res.ok) throw new Error();
      setNote("Svarutkast opprettet — se under «E-postutkast».");
    } catch {
      setNote("Kunne ikke opprette svarutkast.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${!message.isRead ? "border-l-4 border-l-brand" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-brand-dark">{message.subject || "(uten emne)"}</p>
          <p className="text-xs text-slate-500">
            {message.from?.emailAddress?.name ?? message.from?.emailAddress?.address ?? "Ukjent avsender"} ·{" "}
            {new Date(message.receivedDateTime).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" })}
          </p>
          <p className="mt-1 text-sm text-slate-600">{message.bodyPreview}</p>
        </div>
        <button
          onClick={generateReply}
          disabled={busy}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-60"
        >
          {busy ? "..." : "Lag svarutkast"}
        </button>
      </div>
      {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
    </div>
  );
}
