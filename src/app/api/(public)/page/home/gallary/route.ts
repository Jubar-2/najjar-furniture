import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "gallery";

// GET /api/page/home/gallary
export async function GET() {
    try {
        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            return ApiResponse.success({ content: { images: [], imagesSub: [] } });
        }

        const section = await PageSection.findOne({
            pageId: page._id,
            type: SECTION_TYPE,
            isActive: true,
        }).lean();

        if (!section || !section.content) {
            return ApiResponse.success({ content: { images: [], imagesSub: [] } });
        }

        return ApiResponse.success(section);
    } catch (error) {
        console.error("GET /page/home/gallary failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}
