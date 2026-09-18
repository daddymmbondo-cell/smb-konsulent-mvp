import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Kundeportal og backoffice skal aldri indekseres — de er bak innlogging,
      // men vi utelukker dem eksplisitt for søkemotorer likevel.
      disallow: ["/portal", "/admin", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
