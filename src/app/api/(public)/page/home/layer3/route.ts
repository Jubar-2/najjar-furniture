import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "home-layer-3";

// GET /api/page/home/layer3
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
    }).lean();

    if (!section) {
      return ApiResponse.error("Layer 3 section not found.", 404);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("GET /page/home/layer3 failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
