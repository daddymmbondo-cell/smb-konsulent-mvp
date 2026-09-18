"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusLabels: Record<string, string> = {
  NY: "Ny",
  KONTAKTET: "Kontaktet",
  MOTE_BOOKET: "Møte booket",
  TILBUD_SENDT: "Tilbud sendt",
  VUNNET: "Vunnet",
  TAPT: "Tapt",
};

export function LeadStatusSelect({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStatus(currentStatus); // rull tilbake ved feil
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
