import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/sections/banner
// Returns the hero/banner section content for the home page.
export async function GET() {
    try {
        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });

        if (!page) {
            return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
        }

        const section = await PageSection.findOne({
            pageId: page._id,
            type: "banner",
            isActive: true,
        }).lean();

        if (!section) {
            return NextResponse.json({ error: "Banner section not found." }, { status: 404 });
        }

        return ApiResponse.success(section);
    } catch (error) {
        console.error("GET /sections/banner failed:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}