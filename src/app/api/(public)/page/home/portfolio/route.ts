import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "portfolio";

// GET /api/page/home/portfolio
export async function GET() {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return ApiResponse.error("Home page is not found.", 404);
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
      isActive: true,
    }).lean();

    if (!section) {
      return ApiResponse.error("Portfolio section not found.", 404);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("GET /page/home/portfolio failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
