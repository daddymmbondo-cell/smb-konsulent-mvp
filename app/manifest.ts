import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/content/site";

// Next.js-konvensjon: denne filen serveres automatisk på /manifest.webmanifest
// og lenkes automatisk i <head> — ingen manuell <link rel="manifest">-tag nødvendig.
// Dette er det som gjør nettsiden "installerbar" (Legg til på Hjem-skjerm) på
// iPhone og Android, uten å gå via App Store/Play Store.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Bedre kontroll på drift og lønnsomhet for norske butikker og servicebedrifter.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FB",
    theme_color: "#0F2A43",
    lang: "nb-NO",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
