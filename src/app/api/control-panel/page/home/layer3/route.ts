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
// Updates only the items and fields that were actually sent.
export async function PATCH(req: NextRequest) {
  try {
    let rawItems: Record<string, unknown> = {};

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body && typeof body === "object") {
        for (const key of HOME_LAYER_THREE_KEYS) {
          const index = key.replace("item", "");
          if (body[key] && typeof body[key] === "object") {
            const heading = body[key].heading !== undefined ? String(body[key].heading) : undefined;
            const paragraph = body[key].paragraph !== undefined ? String(body[key].paragraph) : undefined;
            if (heading !== undefined || paragraph !== undefined) {
              rawItems[key] = { heading, paragraph };
            }
          } else {
            const heading = body[`heading${index}`] ?? body[`heading_${index}`];
            const paragraph = body[`paragraph${index}`] ?? body[`paragraph_${index}`];
            if (heading !== undefined || paragraph !== undefined) {
              rawItems[key] = {
                heading: heading !== undefined ? String(heading) : undefined,
                paragraph: paragraph !== undefined ? String(paragraph) : undefined,
              };
            }
          }
        }
      }
    } else {
      const formData = await req.formData();
      rawItems = readHomeLayerThreeFromFormData(formData, false);
    }

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

      const existingItem = updatedContent[key] || {};
      const newHeading = item.heading !== undefined ? item.heading : existingItem.heading;
      const newParagraph = item.paragraph !== undefined ? item.paragraph : existingItem.paragraph;
      let newImage = existingItem.image;
      let newImagePublicId = existingItem.imagePublicId;

      if (item.image) {
        const imageCloud = await uploadOnCloudinary(item.image);

        if (!imageCloud) {
          return ApiResponse.error(`Upload failed for ${key}.`, 502);
        }

        const previousPublicId = existingItem.imagePublicId;
        if (previousPublicId) {
          await deleteUploadedFileOnCloudinary(previousPublicId, "image");
        }

        newImage = imageCloud.secure_url;
        newImagePublicId = imageCloud.public_id;
      }

      updatedContent[key] = {
        heading: newHeading,
        paragraph: newParagraph,
        image: newImage,
        imagePublicId: newImagePublicId,
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