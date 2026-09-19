import { ApiResponse } from "@/lib/apiResponse";
import { getPageContent } from "@/lib/getPageContent";

const PAGE_NAME = "terms-conditions";

// GET /api/page/terms-conditions
export async function GET() {
  try {
    const data = await getPageContent(PAGE_NAME);
    if (!data) {
      return ApiResponse.success({ content: null });
    }

    return ApiResponse.success({
      content: { body: data.body },
      updatedAt: data.updatedAt,
    });
  } catch (error) {
    console.error("GET /page/terms-conditions failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}
