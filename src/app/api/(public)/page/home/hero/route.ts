import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/page/home/hero
// Returns the hero/banner section content for the home page.
export async function GET() {
    try {
        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });

        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const section = await PageSection.findOne({
            pageId: page._id,
            type: "banner",
            isActive: true,
        }).lean();

        if (!section) {
            return ApiResponse.error("Banner section not found.", 404);
        }

        return ApiResponse.success(section);
    } catch (error) {
        console.error("GET /page/home/hero failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}