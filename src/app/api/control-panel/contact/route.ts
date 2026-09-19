import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { ContactSchema } from "@/schemas/contact.schema";
import { ApiResponse } from "@/lib/apiResponse";

const PAGE_NAME = "contact";
const SECTION_TYPE = "contact";

// PATCH /api/control-panel/contact
// Replaces the whole contact section content (the full object shaped like
// ContactSchema), auto-creating the Page + section on first save.
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = ContactSchema.safeParse(body);

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

    return ApiResponse.success({
      content: section.content,
      updatedAt: section.updatedAt,
    });
  } catch (error) {
    console.error("PATCH /control-panel/contact failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}