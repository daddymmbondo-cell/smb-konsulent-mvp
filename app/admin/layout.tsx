import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { SITE_NAME } from "@/lib/content/site";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin/leads" className="text-lg font-semibold text-brand-dark">
            {SITE_NAME} — Backoffice
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <Link href="/admin/dashboard" className="hover:text-brand">
              Dashboard
            </Link>
            <Link href="/admin/leads" className="hover:text-brand">
              Leads
            </Link>
            <Link href="/admin/leads/foreslatte" className="hover:text-brand">
              Foreslåtte kundeemner
            </Link>
            <Link href="/admin/innboks" className="hover:text-brand">
              Innboks
            </Link>
            <Link href="/admin/e-post-utkast" className="hover:text-brand">
              E-postutkast
            </Link>
            <Link href="/admin/ukeplan" className="hover:text-brand">
              Ukeplan
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
