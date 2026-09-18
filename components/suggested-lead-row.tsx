"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  id: string;
  name: string;
  naceDescription: string | null;
  municipality: string | null;
  employeeCountFrom: number | null;
  status: string;
};

const statusLabels: Record<string, string> = {
  FORESLATT: "Foreslått",
  GODKJENT: "Godkjent",
  KONVERTERT: "Konvertert til lead",
  AVVIST: "Avvist",
};

export function SuggestedLeadRow({ suggestion }: { suggestion: Suggestion }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function act(action: "godkjenn" | "avvis" | "konverter") {
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/suggested-leads/${suggestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setNote("Noe gikk galt. Prøv igjen.");
    } finally {
      setBusy(null);
    }
  }

  async function draftEmail() {
    setBusy("draft");
    try {
      const res = await fetch(`/api/admin/suggested-leads/${suggestion.id}/draft-email`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      setNote("E-postutkast opprettet — se under «E-postutkast».");
    } catch {
      setNote("Kunne ikke opprette utkast.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <tr className="border-b border-slate-100 last:border-0 align-top">
      <td className="px-4 py-3 font-medium text-brand-dark">{suggestion.name}</td>
      <td className="px-4 py-3 text-slate-600">{suggestion.naceDescription ?? "—"}</td>
      <td className="px-4 py-3 text-slate-600">{suggestion.municipality ?? "—"}</td>
      <td className="px-4 py-3 text-slate-600">{suggestion.employeeCountFrom ?? "—"}</td>
      <td className="px-4 py-3">{statusLabels[suggestion.status] ?? suggestion.status}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {suggestion.status === "FORESLATT" && (
            <>
              <button
                onClick={() => act("godkjenn")}
                disabled={busy !== null}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                Godkjenn
              </button>
              <button
                onClick={() => act("avvis")}
                disabled={busy !== null}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                Avvis
              </button>
            </>
          )}
          {suggestion.status === "GODKJENT" && (
            <>
              <button
                onClick={draftEmail}
                disabled={busy !== null}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                Lag e-postutkast
              </button>
              <button
                onClick={() => act("konverter")}
                disabled={busy !== null}
                className="rounded-lg bg-brand px-2 py-1 text-xs font-medium text-white hover:bg-brand-light"
              >
                Gjør til lead
              </button>
            </>
          )}
        </div>
        {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
      </td>
    </tr>
  );
}
