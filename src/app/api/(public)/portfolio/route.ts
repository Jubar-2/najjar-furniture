import dbConnect from "@/db/dbConnect";
import PortfolioItem from "@/models/portfolioItem.model";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/portfolio
// Lists all portfolio items for the public portfolio page, most recent first.
export async function GET() {
  try {
    await dbConnect();

    const items = await PortfolioItem.find().sort({ createdAt: -1 }).lean();

    const formatted = items.map((item) => ({
      ...item,
      subImages: Array.isArray(item.subImages)
        ? item.subImages
            .map((s: any) => (typeof s === "string" ? s : s?.url))
            .filter(Boolean)
        : [],
    }));

    return ApiResponse.success(formatted);
  } catch (error) {
    console.error("GET /api/portfolio failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
