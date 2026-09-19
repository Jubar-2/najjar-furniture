import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  AboutCreateSchema,
  AboutUpdateSchema,
  readAboutFromFormData,
} from "@/schemas/about.schema";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "about";

// POST /sections/about
// Creates the section. Paragraph + image are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readAboutFromFormData(formData);

    const parsed = AboutCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return ApiResponse.error("Home page is not found.", 404);
    }

    const imageCloud = await uploadOnCloudinary(parsed.data.image);
    if (!imageCloud) {
      return ApiResponse.error("Image upload failed.", 502);
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content: {
        paragraph: parsed.data.paragraph,
        image: { url: imageCloud.secure_url, publicId: imageCloud.public_id },
      },
    });

    return ApiResponse.success(section, "About section created", 201);
  } catch (error) {
    console.error("POST /sections/about failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// PATCH /sections/about
// Updates only the fields actually sent — paragraph and/or image,
// independently of each other.
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readAboutFromFormData(formData);

    const parsed = AboutUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { paragraph, image } = parsed.data;

    if (paragraph === undefined && image === undefined) {
      return ApiResponse.error("No fields provided to update.", 400);
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return ApiResponse.error("Home page is not found.", 404);
    }

    let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: { paragraph: "" },
      });
    }

    const updatedContent: Record<string, unknown> = { ...section.content };

    if (paragraph !== undefined) {
      updatedContent.paragraph = paragraph;
    }

    if (image) {
      const imageCloud = await uploadOnCloudinary(image);

      if (!imageCloud) {
        return ApiResponse.error("Image upload failed.", 502);
      }

      const previousPublicId = (updatedContent.image as { publicId?: string } | undefined)?.publicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }

      updatedContent.image = { url: imageCloud.secure_url, publicId: imageCloud.public_id };
    }

    section.content = updatedContent;
    section.markModified("content");
    await section.save();

    return ApiResponse.success(section);
  } catch (error) {
    console.error("PATCH /sections/about failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}