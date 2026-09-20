import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  PortfolioCreateSchema,
  PortfolioUpdateSchema,
  PORTFOLIO_IMAGE_KEYS,
  readPortfolioFromFormData,
} from "@/schemas/portfolio.schema";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";

const SECTION_TYPE = "portfolio";

// POST /api/sections/portfolio
// Creates the section. Paragraph + all 6 images are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readPortfolioFromFormData(formData);

    const parsed = PortfolioCreateSchema.safeParse(raw);

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

    const content: Record<string, unknown> = { paragraph: parsed.data.paragraph };

    for (const key of PORTFOLIO_IMAGE_KEYS) {
      const imageCloud = await uploadOnCloudinary(parsed.data[key]);
      if (!imageCloud) {
        return ApiResponse.error(`Upload failed for ${key}.`, 502);
      }
      content[key] = { url: imageCloud.secure_url, publicId: imageCloud.public_id };
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content,
    });

    try {
      revalidateTag("home-portfolio", "max");
      revalidatePath("/");
    } catch (revalErr) {
      console.error("Failed to revalidate home portfolio:", revalErr);
    }

    return ApiResponse.success(section, "Portfolio section created", 201);
  } catch (error) {
    console.error("POST /sections/portfolio failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// PATCH /api/sections/portfolio
// Updates only the fields actually sent — paragraph and/or any subset of
// the 6 images, independently of each other.
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readPortfolioFromFormData(formData);

    const parsed = PortfolioUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { paragraph, ...images } = parsed.data;
    const changedImageKeys = PORTFOLIO_IMAGE_KEYS.filter((key) => images[key] !== undefined);

    if (paragraph === undefined && changedImageKeys.length === 0) {
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

    for (const key of changedImageKeys) {
      const file = images[key]!;
      const imageCloud = await uploadOnCloudinary(file);

      if (!imageCloud) {
        return ApiResponse.error(`Upload failed for ${key}.`, 502);
      }

      const previousPublicId = (updatedContent[key] as { publicId?: string } | undefined)?.publicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }

      updatedContent[key] = { url: imageCloud.secure_url, publicId: imageCloud.public_id };
    }

    section.content = updatedContent;
    section.markModified("content");
    await section.save();

    try {
      revalidateTag("home-portfolio", "max");
      revalidatePath("/");
    } catch (revalErr) {
      console.error("Failed to revalidate home portfolio:", revalErr);
    }

    return ApiResponse.success(section);
  } catch (error) {
    console.error("PATCH /sections/portfolio failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}