"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-slate-50 print:hidden sm:block"
    >
      Skriv ut / last ned
    </button>
  );
}
