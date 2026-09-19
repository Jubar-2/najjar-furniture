import { ApiResponse } from "@/lib/apiResponse";
import { getPageBanner } from "@/lib/getPageBanner";
import { getAboutContent } from "@/lib/getAboutContent";
import dbConnect from "@/db/dbConnect";
import Testimonial from "@/models/testimonials.model";

// GET /api/page/about-us
// Returns the about-us page data: banner, about section, and testimonials
export async function GET() {
  try {
    await dbConnect();

    const [banner, about, testimonials] = await Promise.all([
      getPageBanner("about-us"),
      getAboutContent(),
      Testimonial.find().sort({ createdAt: -1 }).lean(),
    ]);

    return ApiResponse.success({
      banner,
      about,
      testimonials,
    });
  } catch (error) {
    console.error("GET /api/page/about-us failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
