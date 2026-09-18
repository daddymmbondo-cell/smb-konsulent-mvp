import Link from "next/link";
import { SITE_NAME } from "@/lib/content/site";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-brand-dark">
          {SITE_NAME}
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/tjenester" className="hover:text-brand">
            Tjenester
          </Link>
          <Link href="/priser" className="hover:text-brand">
            Priser
          </Link>
          <Link href="/om-meg" className="hover:text-brand">
            Om meg
          </Link>
          <Link href="/kontakt" className="hover:text-brand">
            Kontakt
          </Link>
        </nav>
        <Link
          href="/bestill-samtale"
          className="rounded-xl bg-growth px-4 py-2 text-sm font-semibold text-white hover:bg-growth-light"
        >
          Bestill gratis samtale
        </Link>
      </div>
    </header>
  );
}
