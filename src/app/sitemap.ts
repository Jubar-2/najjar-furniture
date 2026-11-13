import type { MetadataRoute } from "next";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PortfolioItem from "@/models/portfolioItem.model";
import { SITE_PAGES } from "@/lib/sitePages";
import { getCanonicalUrl } from "@/lib/siteUrl";

export const revalidate = 3600; // Cache and revalidate sitemap once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pagesMap = new Map<string, Date>();
  let latestPortfolioUpdate: Date | undefined;

  try {
    await dbConnect();

    // Query actual last modified timestamps for each public page
    const [pages, latestPortfolio] = await Promise.all([
      PageModel.find({ pageName: { $in: SITE_PAGES.map((p) => p.pageName) } })
        .select("pageName updatedAt")
        .lean(),
      PortfolioItem.findOne()
        .sort({ updatedAt: -1 })
        .select("updatedAt")
        .lean(),
    ]);

    for (const page of pages) {
      if (page.updatedAt) {
        pagesMap.set(page.pageName, new Date(page.updatedAt));
      }
    }

    if (latestPortfolio?.updatedAt) {
      latestPortfolioUpdate = new Date(latestPortfolio.updatedAt);
    }
  } catch (error) {
    console.error("sitemap() database query error:", error);
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  for (const page of SITE_PAGES) {
    const canonicalUrl = getCanonicalUrl(page.route);

    // Prevent duplicate URLs
    if (seenUrls.has(canonicalUrl)) {
      continue;
    }
    seenUrls.add(canonicalUrl);

    let lastModified = pagesMap.get(page.pageName) || new Date();

    // If portfolio page, use the latest update between page metadata and portfolio items
    if (page.pageName === "portfolio" && latestPortfolioUpdate) {
      if (latestPortfolioUpdate > lastModified) {
        lastModified = latestPortfolioUpdate;
      }
    }

    let priority = 0.8;
    let changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never" = "monthly";

    if (page.pageName === "home") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (page.pageName === "portfolio") {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (page.pageName === "about-us" || page.pageName === "contact") {
      priority = 0.8;
      changeFrequency = "monthly";
    } else if (
      page.pageName === "privacy-policy" ||
      page.pageName === "terms-conditions"
    ) {
      priority = 0.3;
      changeFrequency = "yearly";
    }

    sitemapEntries.push({
      url: canonicalUrl,
      lastModified,
      changeFrequency,
      priority,
    });
  }

  return sitemapEntries;
}

