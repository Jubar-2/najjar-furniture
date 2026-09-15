import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  PageContentCreateSchema,
  PageContentUpdateSchema,
  readPageContentFromJson,
} from "@/schemas/pageContent.schema";

const PAGE_NAME = "privacy-policy";
const SECTION_TYPE = "privacy-policy";

// GET /api/control-panel/page/privacy-policy
// Returns 200 with `content: null` when the section doesn't exist yet, so
// clients don't have to distinguish 404s.
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
    console.error("GET /page/privacy-policy failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST /api/control-panel/page/privacy-policy
// Creates the section with the required body.
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const raw = readPageContentFromJson(json);

    const parsed = PageContentCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();

    let page = await PageModel.findOne({ pageName: PAGE_NAME });
    if (!page) {
      page = await PageModel.create({ pageName: PAGE_NAME, title: "Privacy Policy" });
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content: { body: parsed.data.body },
    });

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error) {
    console.error("POST /page/privacy-policy failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/control-panel/page/privacy-policy
// Updates the body, auto-creating the Page + section on first save.
export async function PATCH(req: NextRequest) {
  try {
    const json = await req.json();
    const raw = readPageContentFromJson(json);

    const parsed = PageContentUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { body } = parsed.data;

    if (body === undefined) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    await dbConnect();

    let page = await PageModel.findOne({ pageName: PAGE_NAME });
    if (!page) {
      page = await PageModel.create({ pageName: PAGE_NAME, title: "Privacy Policy" });
    }

    let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: { body: "" },
      });
    }

    const updatedContent: Record<string, unknown> = { ...section.content };
    updatedContent.body = body;

    section.content = updatedContent;
    section.markModified("content");
    await section.save();

    return NextResponse.json(
      { data: { content: section.content, updatedAt: section.updatedAt } },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /page/privacy-policy failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}