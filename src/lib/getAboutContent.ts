import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";

export interface AboutImage {
  url?: string;
  publicId?: string;
}

export interface AboutContent {
  paragraph?: string;
  image?: AboutImage;
}

/**
 * Server-side helper to fetch About section content directly from the database.
 */
export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    await dbConnect();

    const pages = await PageModel.find({
      pageName: { $in: ["home", "about-us", "about"] },
    }).select("_id");

    const pageIds = pages.map((p) => p._id);

    const section = await PageSection.findOne({
      pageId: { $in: pageIds },
      type: "about",
      isActive: true,
    }).lean();

    if (!section?.content) return null;

    return section.content as AboutContent;
  } catch (error) {
    console.error("Failed to get about content:", error);
    return null;
  }
}
