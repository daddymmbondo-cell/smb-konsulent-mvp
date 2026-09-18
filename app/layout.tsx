import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
