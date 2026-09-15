import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";
import { ContactMessageCreateSchema } from "@/schemas/contact.schema";

// POST /api/contact/messages
// Public form submission — stores the message in the database.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = ContactMessageCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();

    const message = await ContactMessage.create(parsed.data);

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error("POST /contact/messages failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}