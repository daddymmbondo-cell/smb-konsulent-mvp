import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import { SITE_NAME } from "@/lib/content/site";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Bedre drift og lønnsomhet for din bedrift`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Vi hjelper norske butikker, dagligvarebutikker, kiosker og serveringssteder med å forbedre lønnsomhet, bemanning og drift.",
  openGraph: {
    title: SITE_NAME,
    description:
      "Få bedre kontroll på driften og et tydeligere bilde av hvor bedriften kan forbedre seg.",
    locale: "nb_NO",
    type: "website",
  },
  // Gjør nettsiden installerbar ("Legg til på Hjem-skjerm") på iPhone/iPad —
  // iOS bruker ikke web app manifest-et for disse metatagene, så de må settes
  // eksplisitt her. app/manifest.ts dekker Android/Chrome-installasjon.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F2A43",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <Providers>{children}</Providers>
        <PwaRegister />
      </body>
    </html>
  );
}
