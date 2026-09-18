"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingConfirm({ bookingId, preferredTime }: { bookingId: string; preferredTime: string }) {
  const router = useRouter();
  const [start, setStart] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    if (!start) {
      setMessage("Velg et tidspunkt.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const startDate = new Date(start);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min varighet som standard

      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startIso: startDate.toISOString(), endIso: endDate.toISOString() }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message ?? "Kunne ikke bekrefte tidspunkt.");
      setMessage(body.calendarEventCreated ? "Bekreftet og lagt i Outlook-kalenderen." : "Bekreftet (kalender ikke tilkoblet ennå).");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ukjent feil.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-xs">
      <p className="text-slate-400">Ønsket: {preferredTime}</p>
      <div className="mt-1 flex gap-1">
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="rounded border border-slate-300 px-1 py-0.5 text-xs"
        />
        <button
          onClick={confirm}
          disabled={busy}
          className="rounded bg-brand px-2 py-0.5 font-medium text-white hover:bg-brand-light disabled:opacity-60"
        >
          Bekreft
        </button>
      </div>
      {message && <p className="mt-1 text-slate-500">{message}</p>}
    </div>
  );
}
