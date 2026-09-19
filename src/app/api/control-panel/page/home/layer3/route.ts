import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  HomeLayerThreeSchema,
  HomeLayerThreeUpdateSchema,
  HOME_LAYER_THREE_KEYS,
  readHomeLayerThreeFromFormData,
} from "@/schemas/homeLayerThree.schema";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "home-layer-3";

// POST /api/sections/home-layer-three
// Creates the 6-item section. All 6 items are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawItems = readHomeLayerThreeFromFormData(formData, true);

    const parsed = HomeLayerThreeSchema.safeParse(rawItems);

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

    const content: Record<string, unknown> = {};

    for (const key of HOME_LAYER_THREE_KEYS) {
      const { heading, paragraph, image } = parsed.data[key];
      const imageCloud = await uploadOnCloudinary(image);

      if (!imageCloud) {
        return ApiResponse.error(`Upload failed for ${key}.`, 502);
      }

      content[key] = {
        heading,
        paragraph,
        image: imageCloud.secure_url,
        imagePublicId: imageCloud.public_id,
      };
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content,
    });

    return ApiResponse.success(section, "Layer 3 section created", 201);
  } catch (error) {
    console.error("POST /sections/home-layer-three failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// PATCH /api/sections/home-layer-three
// Updates only the items that were actually sent.
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawItems = readHomeLayerThreeFromFormData(formData, false);

    const parsed = HomeLayerThreeUpdateSchema.safeParse(rawItems);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const providedKeys = HOME_LAYER_THREE_KEYS.filter((key) => parsed.data[key] !== undefined);

    if (providedKeys.length === 0) {
      return ApiResponse.error("No fields provided to update.", 400);
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return ApiResponse.error("Home page is not found.", 404);
    }

    const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      return ApiResponse.error("Section not found.", 404);
    }

    const updatedContent: Record<string, any> = { ...section.content };

    for (const key of providedKeys) {
      const item = parsed.data[key];
      if (!item) continue;

      const imageCloud = await uploadOnCloudinary(item.image);

      if (!imageCloud) {
        return ApiResponse.error(`Upload failed for ${key}.`, 502);
      }

      const previousPublicId = updatedContent[key]?.imagePublicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }

      updatedContent[key] = {
        heading: item.heading,
        paragraph: item.paragraph,
        image: imageCloud.secure_url,
        imagePublicId: imageCloud.public_id,
      };
    }

    section.content = updatedContent;
    section.markModified("content");
    await section.save();

    return ApiResponse.success(section);
  } catch (error) {
    console.error("PATCH /sections/home-layer-three failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}