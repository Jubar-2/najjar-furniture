import dbConnect from "@/db/dbConnect";
import Testimonial from "@/models/testimonials.model";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/testimonials
// Lists all testimonials, most recent first.
export async function GET() {
    try {
        await dbConnect();

        const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

        return ApiResponse.success(testimonials);
    } catch (error) {
        console.error("GET /testimonials failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}
