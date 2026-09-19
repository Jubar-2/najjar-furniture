import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/control-panel/contact/messages
// Lists all submitted messages, most recent first.
export async function GET() {
  try {
    await dbConnect();

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return ApiResponse.success(messages);
  } catch (error) {
    console.error("GET /contact/messages failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}