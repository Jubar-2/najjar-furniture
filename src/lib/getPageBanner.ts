import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import type { PageBannerData } from "@/schemas/pageBanner.schema";

export function normalizePageName(pageName: string): string {
  if (pageName === "contact-us") return "contact";
  return pageName;
}

export async function getPageBanner(pageName: string): Promise<PageBannerData | null> {
  try {
    await dbConnect();

    const normalized = normalizePageName(pageName);
    const page = await PageModel.findOne({
      pageName: { $in: [normalized, pageName] },
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
  } catch (error) {
    console.error(`Failed to get page banner for ${pageName}:`, error);
    return null;
  }
}
