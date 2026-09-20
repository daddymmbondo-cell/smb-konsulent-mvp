import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, SITE_EMAIL, SITE_ORG_NUMBER, SITE_ADDRESS } from "@/lib/content/site";

export const metadata = { title: "Personvernerklæring" };

export default function PersonvernPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-brand-dark">Personvernerklæring</h1>
        <p className="mt-2 text-sm text-slate-500">Sist oppdatert: 20. september 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="font-semibold text-brand-dark">Behandlingsansvarlig</h2>
            <p className="mt-2">
              {SITE_NAME} (org.nr. {SITE_ORG_NUMBER}), {SITE_ADDRESS}, er behandlingsansvarlig for
              personopplysningene som samles inn gjennom denne nettsiden og kundeportalen. Kontakt
              oss på {SITE_EMAIL} ved spørsmål om personvern.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Hvilke opplysninger vi samler inn</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Kontaktskjema:</strong> navn, virksomhetsnavn, e-post, telefon, og eventuell
                tilleggsinformasjon du velger å oppgi (type virksomhet, antall ansatte, utfordringer,
                ønsket tidspunkt for samtale, melding).
              </li>
              <li>
                <strong>Brukerkonto i kundeportalen:</strong> navn, e-post og passord (lagret som
                irreversibel hash — vi har aldri tilgang til passordet ditt i klartekst).
              </li>
              <li>
                <strong>Kartlegging:</strong> opplysninger du oppgir om virksomhetens drift og
                økonomi (f.eks. omsetning, kostnader, bemanning). Disse knyttes til din virksomhet i
                kundeportalen og deles aldri med andre kunder.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Hvorfor vi behandler opplysningene</h2>
            <p className="mt-2">
              Vi bruker opplysningene til å svare på henvendelser, avtale og gjennomføre
              kartleggingssamtaler, gi deg tilgang til kundeportalen, og utarbeide rapporter og
              anbefalinger som en del av tjenestene du har bestilt.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Rettslig grunnlag</h2>
            <p className="mt-2">
              Kontaktskjemaet behandles på grunnlag av samtykket du gir når du sender det inn.
              Opplysninger knyttet til et kundeforhold (brukerkonto, kartlegging, rapporter)
              behandles for å oppfylle avtalen om leverte tjenester. Du kan når som helst trekke
              tilbake et samtykke ved å kontakte oss.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Lagringstid</h2>
            <p className="mt-2">
              Opplysninger fra kontaktskjemaet lagres så lenge det er relevant for oppfølging av
              henvendelsen, og slettes senest 12 måneder etter siste kontakt dersom det ikke blir et
              kundeforhold. Opplysninger knyttet til et aktivt kundeforhold lagres så lenge
              kundeforholdet varer, og slettes eller anonymiseres innen rimelig tid etter at
              forholdet er avsluttet, med mindre vi er lovpålagt å oppbevare dem lenger (f.eks.
              bokføringsregelverket).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Hvem vi deler opplysninger med</h2>
            <p className="mt-2">
              Vi selger eller deler aldri opplysningene dine med andre virksomheter til
              markedsføringsformål. Opplysningene lagres hos våre databehandlere for hosting og
              database (Vercel og Neon), som begge er underlagt databehandleravtale og GDPR-krav.
              Ingen andre tredjeparter får tilgang til opplysningene dine uten ditt samtykke eller et
              lovpålagt grunnlag.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Dine rettigheter</h2>
            <p className="mt-2">Du har rett til å:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>få innsyn i hvilke opplysninger vi har lagret om deg</li>
              <li>få rettet uriktige opplysninger</li>
              <li>få slettet opplysningene dine, med mindre vi har en lovpålagt plikt til å beholde dem</li>
              <li>be om at opplysningene dine utleveres i et strukturert format (dataportabilitet)</li>
              <li>klage til Datatilsynet dersom du mener vi behandler opplysningene dine i strid med regelverket</li>
            </ul>
            <p className="mt-2">
              Ta kontakt på {SITE_EMAIL} for å benytte deg av noen av disse rettighetene.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-brand-dark">Informasjonskapsler (cookies)</h2>
            <p className="mt-2">
              Nettsiden bruker kun nødvendige informasjonskapsler for innlogging og sikker
              sesjonshåndtering i kundeportalen. Vi bruker ikke informasjonskapsler til
              markedsføring eller sporing på tvers av nettsider.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
