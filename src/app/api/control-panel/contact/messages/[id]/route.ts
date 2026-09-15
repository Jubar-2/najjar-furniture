import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";
import { ContactMessageStatusSchema } from "@/schemas/contact.schema";

// PATCH /api/control-panel/contact/messages/:id
// Updates the message status (new / read / resolved).
export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/control-panel/contact/messages/[id]">) {
  try {
    const { id } = await params;

    const body = await req.json();

    const parsed = ContactMessageStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).lean();

    if (!message) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ data: message }, { status: 200 });
  } catch (error) {
    console.error("PATCH /contact/messages/:id failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE /api/control-panel/contact/messages/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext<"/api/control-panel/contact/messages/[id]">) {
  try {
    const { id } = await params;

    await dbConnect();

    const message = await ContactMessage.findByIdAndDelete(id).lean();

    if (!message) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { id } }, { status: 200 });
  } catch (error) {
    console.error("DELETE /contact/messages/:id failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}