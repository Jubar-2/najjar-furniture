import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/control-panel",
          "/control-panel/",
          "/api/",
          "/simple",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/control-panel",
          "/control-panel/",
          "/api/",
          "/simple",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

