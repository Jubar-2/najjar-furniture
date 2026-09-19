import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  PageContentCreateSchema,
  PageContentUpdateSchema,
  readPageContentFromJson,
} from "@/schemas/pageContent.schema";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";

const PAGE_NAME = "privacy-policy";
const SECTION_TYPE = "privacy-policy";

// POST /api/control-panel/page/privacy-policy
// Creates the section with the required body.
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const raw = readPageContentFromJson(json);

    const parsed = PageContentCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
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

    revalidateTag("page-content-privacy-policy", "max");
    revalidateTag("page-content", "max");
    revalidatePath("/privacy-policy");

    return ApiResponse.success(section, "Privacy policy created", 201);
  } catch (error) {
    console.error("POST /page/privacy-policy failed:", error);
    return ApiResponse.fatal("Something went wrong.");
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
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { body } = parsed.data;

    if (body === undefined) {
      return ApiResponse.error("No fields provided to update.", 400);
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

    revalidateTag("page-content-privacy-policy", "max");
    revalidateTag("page-content", "max");
    revalidatePath("/privacy-policy");

    return ApiResponse.success({
      content: section.content,
      updatedAt: section.updatedAt,
    });
  } catch (error) {
    console.error("PATCH /page/privacy-policy failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}