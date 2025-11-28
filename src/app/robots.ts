import { MetadataRoute } from "next";
import { FALLBACK_BASE_URL } from "../constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og/*"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
