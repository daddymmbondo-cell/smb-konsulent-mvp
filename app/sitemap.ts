import { MetadataRoute } from "next";
import { services } from "@/lib/content/services";

// NB: bytt ut med faktisk domene når det er valgt.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/tjenester", "/priser", "/om-meg", "/kontakt", "/bestill-samtale", "/personvern"];

  const servicePages = services.map((s) => `/tjenester/${s.slug}`);

  return [...staticPages, ...servicePages].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
