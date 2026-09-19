import { NextRequest } from "next/server";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";
import { normalizePageName } from "@/lib/getPageBanner";

// GET /api/page/:pageName/banner
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const { pageName } = await params;
    const normalized = normalizePageName(pageName);

    await dbConnect();

    const page = await PageModel.findOne({
      pageName: { $in: [normalized, pageName] },
    });

    if (!page) {
      return ApiResponse.error("Page not found.", 404);
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: "banner",
      isActive: true,
    }).lean();

    if (!section) {
      return ApiResponse.error("Banner not found.", 404);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("GET /api/page/:pageName/banner failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
