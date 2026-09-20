import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { SITE_NAME } from "@/lib/content/site";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/portal" className="text-lg font-semibold text-brand-dark">
            {SITE_NAME} — Kundeportal
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/portal" className="hover:text-brand">
              Oversikt
            </Link>
            <Link href="/portal/utvikling" className="hover:text-brand">
              Utvikling
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
