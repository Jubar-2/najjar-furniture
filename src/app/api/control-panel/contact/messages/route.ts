import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import ContactMessage from "@/models/contactMessage.model";

// GET /api/control-panel/contact/messages
// Lists all submitted messages, most recent first.
export async function GET() {
  try {
    await dbConnect();

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error) {
    console.error("GET /contact/messages failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}