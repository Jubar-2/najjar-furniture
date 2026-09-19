import dbConnect from "@/db/dbConnect";
import PageSection from "@/models/pageSections.model";
import PageModel from "@/models/page.model";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "home-layer-2";

// GET /api/page/home/layer2
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
      return ApiResponse.error("Layer 2 section not found.", 404);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("GET /page/home/layer2 failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
