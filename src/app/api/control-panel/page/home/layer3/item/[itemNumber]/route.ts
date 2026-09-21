import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  HomeLayerItemSchema,
  HomeLayerItemUpdateSchema,
  readSingleLayerItemFromFormData,
} from "@/schemas/homeLayerThree.schema";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";

const SECTION_TYPE = "home-layer-3";
const VALID_NUMBERS = ["1", "2", "3", "4", "5", "6"] as const;

interface RouteParams {
  params: Promise<{ itemNumber: string }>;
}

function normalizeItemParam(rawParam: string): { num: string; itemKey: string } | null {
  const num = rawParam.toLowerCase().replace(/^item/, "");
  if (!VALID_NUMBERS.includes(num as (typeof VALID_NUMBERS)[number])) {
    return null;
  }
  return { num, itemKey: `item${num}` };
}

async function handleSaveItem(req: NextRequest, { params }: RouteParams) {
  try {
    const { itemNumber } = await params;
    const normalized = normalizeItemParam(itemNumber);

    if (!normalized) {
      return ApiResponse.error(
        `Invalid item number "${itemNumber}". Must be between 1 and 6.`,
        400
      );
    }

    const { num, itemKey } = normalized;

    // Read payload based on content-type (FormData or JSON)
    const contentType = req.headers.get("content-type") || "";
    let heading: string | undefined;
    let paragraph: string | undefined;
    let image: File | undefined;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body && typeof body === "object") {
        const itemObj = body[itemKey] || body;
        heading =
          itemObj.heading !== undefined
            ? String(itemObj.heading)
            : body[`heading${num}`] !== undefined
            ? String(body[`heading${num}`])
            : undefined;
        paragraph =
          itemObj.paragraph !== undefined
            ? String(itemObj.paragraph)
            : body[`paragraph${num}`] !== undefined
            ? String(body[`paragraph${num}`])
            : undefined;
      }
    } else {
      const formData = await req.formData();
      const extracted = readSingleLayerItemFromFormData(formData, num);
      heading = extracted.heading;
      paragraph = extracted.paragraph;
      image = extracted.image;
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return ApiResponse.error("Home page is not found.", 404);
    }

    let section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
    });

    const isNewSection = !section;
    const existingContent: Record<string, any> = section?.content ? { ...section.content } : {};
    const existingItem = existingContent[itemKey] || {};
    const hasExistingImage = !!existingItem.image;

    // Validation:
    // If there is no existing image for this item (or creating new section),
    // heading, paragraph, and image are all required.
    if (!hasExistingImage) {
      const parsed = HomeLayerItemSchema.safeParse({ heading, paragraph, image });
      if (!parsed.success) {
        return ApiResponse.error(
          `Validation failed for Item ${num}.`,
          422,
          z.treeifyError(parsed.error)
        );
      }
      heading = parsed.data.heading;
      paragraph = parsed.data.paragraph;
      image = parsed.data.image;
    } else {
      // Updating an existing item: heading, paragraph, or image can be updated independently
      const parsed = HomeLayerItemUpdateSchema.safeParse({ heading, paragraph, image });
      if (!parsed.success) {
        return ApiResponse.error(
          `Validation failed for Item ${num}.`,
          422,
          z.treeifyError(parsed.error)
        );
      }
      heading = parsed.data.heading;
      paragraph = parsed.data.paragraph;
      image = parsed.data.image;
    }

    let newImageUrl = existingItem.image;
    let newImagePublicId = existingItem.imagePublicId;

    // If a new image was uploaded:
    if (image) {
      // 1. Upload new image to Cloudinary
      const imageCloud = await uploadOnCloudinary(image);
      if (!imageCloud) {
        return ApiResponse.error(`Cloudinary upload failed for Item ${num}.`, 502);
      }

      // 2. Only delete old image AFTER the new upload succeeds
      const previousPublicId = existingItem.imagePublicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }

      // 3. Set new Cloudinary credentials
      newImageUrl = imageCloud.secure_url;
      newImagePublicId = imageCloud.public_id;
    }

    // Update the item content
    existingContent[itemKey] = {
      heading: heading !== undefined && heading !== "" ? heading : existingItem.heading,
      paragraph: paragraph !== undefined && paragraph !== "" ? paragraph : existingItem.paragraph,
      image: newImageUrl,
      imagePublicId: newImagePublicId,
    };

    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: existingContent,
      });
    } else {
      section.content = existingContent;
      section.markModified("content");
      await section.save();
    }

    // Revalidate caches so changes show immediately
    try {
      revalidateTag("home-layer-3", "max");
      revalidateTag("home-page-data", "max");
      revalidateTag("page-sections", "max");
      revalidatePath("/");
    } catch (revalErr) {
      console.error(`Failed to revalidate cache after Layer 3 Item ${num} update:`, revalErr);
    }

    return ApiResponse.success(
      section,
      `Item ${num} saved successfully.`,
      isNewSection ? 201 : 200
    );
  } catch (error) {
    console.error("POST /control-panel/page/home/layer3/item/[itemNumber] failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// Support both POST and PATCH for flexibility
export async function POST(req: NextRequest, context: RouteParams) {
  return handleSaveItem(req, context);
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  return handleSaveItem(req, context);
}
