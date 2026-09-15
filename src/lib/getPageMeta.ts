import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import { getSitePage, SITE_NAME } from "@/lib/sitePages";
import type { Metadata } from "next";

export interface ResolvedPageMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  author: string;
}

/**
 * Reads the saved meta settings for a page from the DB and resolves them
 * against the site defaults, so `generateMetadata()` always has complete
 * values even when the admin never saved anything.
 */
export async function getPageMeta(pageName: string): Promise<ResolvedPageMeta> {
  const fallback = getSitePage(pageName);

  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName }).lean();

    if (!page) {
      return {
        title: fallback?.defaultTitle ?? SITE_NAME,
        description: fallback?.defaultDescription ?? "",
        keywords: fallback?.defaultKeywords ?? "",
        ogImage: "",
        author: SITE_NAME,
      };
    }

    return {
      title: page.meta_title || fallback?.defaultTitle || SITE_NAME,
      description: page.meta_description || fallback?.defaultDescription || "",
      keywords: page.meta_keywords || fallback?.defaultKeywords || "",
      ogImage: page.meta_og_image || "",
      author: page.meta_author || SITE_NAME,
    };
  } catch (error) {
    console.error(`getPageMeta("${pageName}") failed:`, error);
    return {
      title: fallback?.defaultTitle ?? SITE_NAME,
      description: fallback?.defaultDescription ?? "",
      keywords: fallback?.defaultKeywords ?? "",
      ogImage: "",
      author: SITE_NAME,
    };
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
      ? meta.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    authors: meta.author ? [{ name: meta.author }] : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description || undefined,
      ...(meta.ogImage ? { images: [{ url: meta.ogImage }] } : {}),
    },
  };
}