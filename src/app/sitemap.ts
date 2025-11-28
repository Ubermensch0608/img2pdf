import { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { FALLBACK_BASE_URL } from "../constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;

  const routes = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: routing.locales.reduce(
        (acc, loc) => {
          acc[loc] = `${baseUrl}/${loc}`;
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
  }));

  return routes;
}
