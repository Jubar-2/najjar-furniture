import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection, { type PageSectionType } from "@/models/pageSections.model";

export interface ResolvedPageContent {
  body: string;
  updatedAt: Date | null;
}

/**
 * Server-side helper to fetch page section content directly from the database.
 * Reusable across server components, metadata generators, and API routes.
 */
export async function getPageContent(
  pageName: string,
  sectionType: PageSectionType | string = pageName
): Promise<ResolvedPageContent | null> {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName }).lean();
    if (!page) return null;

    const section = await PageSection.findOne({
      pageId: page._id,
      type: sectionType as PageSectionType,
      isActive: true,
    }).lean();

    if (!section?.content) return null;

    const content = section.content as { body?: unknown };
    const body = typeof content.body === "string" ? content.body.trim() : "";

    return {
      body,
      updatedAt: section.updatedAt ? new Date(section.updatedAt) : null,
    };
  } catch (error) {
    console.error(`Failed to get page content for "${pageName}":`, error);
    return null;
  }
}
