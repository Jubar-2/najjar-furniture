import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";
import { ContactMessageCreateSchema } from "@/schemas/contact.schema";
import { ApiResponse } from "@/lib/apiResponse";

// POST /api/contact/messages
// Public form submission — stores the message in the database.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = ContactMessageCreateSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    await dbConnect();

    const message = await ContactMessage.create(parsed.data);

    return ApiResponse.success(message, "Message sent successfully", 201);
  } catch (error) {
    console.error("POST /contact/messages failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}