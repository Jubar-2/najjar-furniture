import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";
import { ContactMessageStatusSchema } from "@/schemas/contact.schema";
import { ApiResponse } from "@/lib/apiResponse";

// PATCH /api/control-panel/contact/messages/:id
// Updates the message status (new / read / resolved).
export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/control-panel/contact/messages/[id]">) {
  try {
    const { id } = await params;

    const body = await req.json();

    const parsed = ContactMessageStatusSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    await dbConnect();

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).lean();

    if (!message) {
      return ApiResponse.error("Message not found.", 404);
    }

    return ApiResponse.success(message);
  } catch (error) {
    console.error("PATCH /contact/messages/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// DELETE /api/control-panel/contact/messages/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext<"/api/control-panel/contact/messages/[id]">) {
  try {
    const { id } = await params;

    await dbConnect();

    const message = await ContactMessage.findByIdAndDelete(id).lean();

    if (!message) {
      return ApiResponse.error("Message not found.", 404);
    }

    return ApiResponse.success({ id });
  } catch (error) {
    console.error("DELETE /contact/messages/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}