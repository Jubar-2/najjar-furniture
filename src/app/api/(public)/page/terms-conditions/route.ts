import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

const PAGE_NAME = "terms-conditions";
const SECTION_TYPE = "terms-conditions";

// GET /api/page/terms-conditions
export async function GET() {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: PAGE_NAME });
    if (!page) {
      return ApiResponse.success({ content: null });
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
      isActive: true,
    }).lean();

    if (!section) {
      return ApiResponse.success({ content: null });
    }

    return ApiResponse.success({
      content: section.content,
      updatedAt: section.updatedAt,
    });
  } catch (error) {
    console.error("GET /page/terms-conditions failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
