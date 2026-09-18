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
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
