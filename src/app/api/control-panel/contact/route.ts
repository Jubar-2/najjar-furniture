import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ContactSchema } from "@/schemas/contact.schema";

const PAGE_NAME = "contact";
const SECTION_TYPE = "contact";

// GET /api/control-panel/contact
// Returns 200 with `content: null` when the section doesn't exist yet.
export async function GET() {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: PAGE_NAME });
    if (!page) {
      return NextResponse.json({ data: { content: null } }, { status: 200 });
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
      isActive: true,
    }).lean();

    if (!section) {
      return NextResponse.json({ data: { content: null } }, { status: 200 });
    }

    return NextResponse.json(
      { data: { content: section.content, updatedAt: section.updatedAt } },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /control-panel/contact failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/control-panel/contact
// Replaces the whole contact section content (the full object shaped like
// ContactSchema), auto-creating the Page + section on first save.
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();

    let page = await PageModel.findOne({ pageName: PAGE_NAME });
    if (!page) {
      page = await PageModel.create({ pageName: PAGE_NAME, title: "Contact Us" });
    }

    let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: parsed.data,
      });
    } else {
      section.content = parsed.data;
      section.markModified("content");
      await section.save();
    }

    return NextResponse.json(
      { data: { content: section.content, updatedAt: section.updatedAt } },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /control-panel/contact failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}