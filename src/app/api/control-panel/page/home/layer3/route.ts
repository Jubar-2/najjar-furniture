import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/lib/cloudinary";
import PageModel from "@/models/Page";
import PageSection from "@/models/PageSection";
import {
  HomeLayerThreeSchema,
  HomeLayerThreeUpdateSchema,
  HOME_LAYER_THREE_KEYS,
  readHomeLayerThreeFromFormData,
} from "@/schemas/homeLayerThree";

// Keep this in one place — POST and PATCH were previously using two
// different, mismatched type strings ("home-lear3" vs "home-lear2"),
// which meant PATCH could never find the section POST had just created.
const SECTION_TYPE = "home-layer-3";

// POST /api/sections/home-layer-three
// Creates the 6-item section. All 6 items are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawItems = readHomeLayerThreeFromFormData(formData, true);

    const parsed = HomeLayerThreeSchema.safeParse(rawItems);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
    }

    const content: Record<string, unknown> = {};

    // Upload each of the 6 images and build content item-by-item — the
    // original code never did this loop at all; it uploaded a single
    // undefined `banner` and discarded all 6 items entirely.
    for (const key of HOME_LAYER_THREE_KEYS) {
      const { heading, paragraph, image } = parsed.data[key];
      const imageCloud = await uploadOnCloudinary(image);

      if (!imageCloud) {
        return NextResponse.json({ error: `Upload failed for ${key}.` }, { status: 502 });
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

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error) {
    console.error("POST /sections/home-layer-three failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/sections/home-layer-three
// Updates only the items that were actually sent — untouched items keep
// their existing content instead of being wiped or required on every call.
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawItems = readHomeLayerThreeFromFormData(formData, false);

    const parsed = HomeLayerThreeUpdateSchema.safeParse(rawItems);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const providedKeys = HOME_LAYER_THREE_KEYS.filter((key) => parsed.data[key] !== undefined);

    if (providedKeys.length === 0) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
    }

    const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      return NextResponse.json({ error: "Section not found." }, { status: 404 });
    }

    const updatedContent: Record<string, any> = { ...section.content };

    for (const key of providedKeys) {
      const item = parsed.data[key];
      if (!item) continue;

      const imageCloud = await uploadOnCloudinary(item.image);

      if (!imageCloud) {
        return NextResponse.json({ error: `Upload failed for ${key}.` }, { status: 502 });
      }

      // Best-effort cleanup of the replaced image's old asset.
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
    section.markModified("content"); // Mixed fields need this — Mongoose
                                      // won't detect in-place mutations otherwise.
    await section.save();

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("PATCH /sections/home-layer-three failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}