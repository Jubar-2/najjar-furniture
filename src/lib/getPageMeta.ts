import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import { getSitePage, SITE_NAME } from "@/lib/sitePages";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

export interface ResolvedPageMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  author: string;
  googleSiteVerification?: string;
}

/**
 * Directly queries the database for the active Google Search Console verification code.
 * The primary canonical store is `pageName: "home"`, with fallback to any page with
 * a configured verification code.
 */
async function fetchGoogleVerificationFromDb(): Promise<string> {
  await dbConnect();

  // Canonical store: home page
  const homePage = await PageModel.findOne({ pageName: "home" })
    .select("google_site_verification")
    .lean();

  if (homePage?.google_site_verification?.trim()) {
    return homePage.google_site_verification.trim();
  }

  // Fallback: any page record with google_site_verification set
  const anyPage = await PageModel.findOne({
    google_site_verification: { $exists: true, $ne: "" },
  })
    .select("google_site_verification")
    .lean();

  return anyPage?.google_site_verification?.trim() || "";
}

/**
 * Returns the cached Google Search Console verification code for site-wide injection.
 * Cached for fast SSR performance, revalidated on admin updates.
 */
export async function getGoogleVerificationCode(): Promise<string> {
  try {
    const getCached = unstable_cache(
      fetchGoogleVerificationFromDb,
      ["site-google-verification"],
      {
        revalidate: 900,
        tags: ["site-google-verification", "page-meta"],
      },
    );

    return await getCached();
  } catch {
    // If unstable_cache is unavailable in the current runtime context, fetch directly
    try {
      return await fetchGoogleVerificationFromDb();
    } catch (err) {
      console.error("fetchGoogleVerificationFromDb fallback failed:", err);
      return "";
    }
  }
}

async function fetchPageMetaFromDb(
  pageName: string,
): Promise<ResolvedPageMeta> {
  const fallback = getSitePage(pageName);

  await dbConnect();

  const [page, siteVerificationCode] = await Promise.all([
    PageModel.findOne({ pageName }).lean(),
    fetchGoogleVerificationFromDb(),
  ]);

  const effectiveVerification =
    page?.google_site_verification?.trim() || siteVerificationCode || undefined;

  if (!page) {
    return {
      title: fallback?.defaultTitle ?? SITE_NAME,
      description: fallback?.defaultDescription ?? "",
      keywords: fallback?.defaultKeywords ?? "",
      ogImage: "",
      author: SITE_NAME,
      googleSiteVerification: effectiveVerification,
    };
  }

  return {
    title: page.meta_title || fallback?.defaultTitle || SITE_NAME,
    description: page.meta_description || fallback?.defaultDescription || "",
    keywords: page.meta_keywords || fallback?.defaultKeywords || "",
    ogImage: page.meta_og_image || "",
    author: page.meta_author || SITE_NAME,
    googleSiteVerification: effectiveVerification,
  };
}

/**
 * Reads the saved meta settings for a page from the DB and resolves them
 * against the site defaults, so `generateMetadata()` always has complete
 * values even when the admin never saved anything.
 */
export async function getPageMeta(pageName: string): Promise<ResolvedPageMeta> {
  const fallback = getSitePage(pageName);

  try {
    const getCachedMeta = unstable_cache(
      () => fetchPageMetaFromDb(pageName),
      [`page-meta-${pageName}`],
      {
        revalidate: 900,
        tags: [
          `page-meta-${pageName}`,
          "page-meta",
          "site-google-verification",
        ],
      },
    );

    return await getCachedMeta();
  } catch {
    // If unstable_cache is unavailable in current runtime context, query DB directly
    try {
      return await fetchPageMetaFromDb(pageName);
    } catch (error) {
      console.error(`getPageMeta("${pageName}") failed:`, error);
      return {
        title: fallback?.defaultTitle ?? SITE_NAME,
        description: fallback?.defaultDescription ?? "",
        keywords: fallback?.defaultKeywords ?? "",
        ogImage: "",
        author: SITE_NAME,
        googleSiteVerification: undefined,
      };
    }
  }
}

/**
 * Builds a Next.js Metadata object from a resolved meta. Pass the resolved
 * values in so callers can `await getPageMeta()` once and use the result
 * for both metadata and rendering if needed.
 */
export function buildMetadata(meta: ResolvedPageMeta): Metadata {
  return {
    title: {
      absolute: meta.title,
    },
    description: meta.description || undefined,
    keywords: meta.keywords
      ? meta.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined,
    authors: meta.author ? [{ name: meta.author }] : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description || undefined,
      ...(meta.ogImage ? { images: [{ url: meta.ogImage }] } : {}),
    },
    verification: meta.googleSiteVerification
      ? {
          google: meta.googleSiteVerification,
        }
      : undefined,
  };
}
