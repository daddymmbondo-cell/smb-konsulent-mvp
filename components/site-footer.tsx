import { SITE_NAME, SITE_ORG_NUMBER, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS } from "@/lib/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-sm text-slate-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p>{SITE_NAME} — org.nr. {SITE_ORG_NUMBER}</p>
        <p className="mt-1">
          {SITE_EMAIL} · {SITE_PHONE} · {SITE_ADDRESS}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. Alle rettigheter forbeholdt.{" "}
          <a href="/personvern" className="underline">
            Personvernerklæring
          </a>
        </p>
      </div>
    </footer>
  );
}
