import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import type { PageBannerData } from "@/schemas/pageBanner.schema";
import { unstable_cache } from "next/cache";

export function normalizePageName(pageName: string): string {
  const trimmed = pageName.trim();
  if (trimmed === "contact-us") return "contact";
  if (trimmed === "terms-and-conditions") return "terms-conditions";
  return trimmed;
}

async function fetchPageBannerFromDb(normalized: string): Promise<PageBannerData | null> {
  await dbConnect();

  const page = await PageModel.findOne({
    pageName: { $in: [normalized] },
  });

  if (!page) return null;

  const section = await PageSection.findOne({
    pageId: page._id,
    type: "banner",
    isActive: true,
  }).lean();

  if (!section?.content) return null;

  const content = section.content as Record<string, unknown>;
  const image = typeof content.image === "string" ? content.image : "";

  if (!image) return null;

  return {
    image,
    imagePublicId: typeof content.imagePublicId === "string" ? content.imagePublicId : undefined,
    title: typeof content.title === "string" ? content.title : undefined,
    subtitle: typeof content.subtitle === "string" ? content.subtitle : undefined,
  };
}

export async function getPageBanner(pageName: string): Promise<PageBannerData | null> {
  try {
    const normalized = normalizePageName(pageName);
    const getCachedBanner = unstable_cache(
      () => fetchPageBannerFromDb(normalized),
      [`page-banner-${normalized}`],
      {
        revalidate: 900,
        tags: [`page-banner-${normalized}`, "page-banner"],
      }
    );

    return await getCachedBanner();
  } catch (error) {
    console.error(`Failed to get page banner for ${pageName}:`, error);
    return null;
  }
}

