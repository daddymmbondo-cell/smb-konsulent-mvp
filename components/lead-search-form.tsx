"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LeadSearchForm({ naceCodes }: { naceCodes: Array<{ code: string; label: string }> }) {
  const router = useRouter();
  const [naeringskode, setNaeringskode] = useState(naceCodes[0]?.code ?? "");
  const [kommunenummer, setKommunenummer] = useState("");
  const [fraAntallAnsatte, setFraAntallAnsatte] = useState("");
  const [tilAntallAnsatte, setTilAntallAnsatte] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setStatus("searching");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/suggested-leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naeringskode,
          kommunenummer: kommunenummer || undefined,
          fraAntallAnsatte: fraAntallAnsatte ? Number(fraAntallAnsatte) : undefined,
          tilAntallAnsatte: tilAntallAnsatte ? Number(tilAntallAnsatte) : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Søket feilet.");
      }
      const data = await res.json();
      setMessage(`Fant ${data.count} treff (${data.totalAvailable} totalt i registeret for dette søket).`);
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ukjent feil.");
    }
  }

  return (
    <form onSubmit={handleSearch} className="mt-4 grid gap-4 sm:grid-cols-4">
      <div>
        <label htmlFor="naeringskode" className="block text-sm font-medium text-slate-700">
          Bransje (næringskode)
        </label>
        <select
          id="naeringskode"
          className="input mt-1"
          value={naeringskode}
          onChange={(e) => setNaeringskode(e.target.value)}
        >
          {naceCodes.map((n) => (
            <option key={n.code} value={n.code}>
              {n.code} — {n.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="kommunenummer" className="block text-sm font-medium text-slate-700">
          Kommunenummer (valgfritt)
        </label>
        <input
          id="kommunenummer"
          className="input mt-1"
          placeholder="F.eks. 0301 (Oslo)"
          value={kommunenummer}
          onChange={(e) => setKommunenummer(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fraAntallAnsatte" className="block text-sm font-medium text-slate-700">
          Min. ansatte
        </label>
        <input
          id="fraAntallAnsatte"
          type="number"
          className="input mt-1"
          value={fraAntallAnsatte}
          onChange={(e) => setFraAntallAnsatte(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="tilAntallAnsatte" className="block text-sm font-medium text-slate-700">
          Maks ansatte
        </label>
        <input
          id="tilAntallAnsatte"
          type="number"
          className="input mt-1"
          value={tilAntallAnsatte}
          onChange={(e) => setTilAntallAnsatte(e.target.value)}
        />
      </div>
      <div className="sm:col-span-4">
        <button
          type="submit"
          disabled={status === "searching"}
          className="rounded-xl bg-growth px-5 py-2.5 text-sm font-semibold text-white hover:bg-growth-light disabled:opacity-60"
        >
          {status === "searching" ? "Søker..." : "Søk i Enhetsregisteret"}
        </button>
        {message && (
          <p className={`mt-2 text-sm ${status === "error" ? "text-red-600" : "text-slate-600"}`}>{message}</p>
        )}
      </div>
    </form>
  );
}
