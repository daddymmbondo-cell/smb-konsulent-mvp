import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Personvernerklæring" };

export default function PersonvernPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-brand-dark">Personvernerklæring</h1>
        <p className="mt-4 text-sm text-slate-600">
          [PLASSHOLDER — fyll inn faktisk personvernerklæring før lansering, i tråd med GDPR/personopplysningsloven.
          Skal blant annet beskrive hvilke opplysninger som samles inn, formål, lagringstid, dine rettigheter
          (innsyn, sletting, retting) og kontaktinformasjon for personvernansvarlig.]
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
