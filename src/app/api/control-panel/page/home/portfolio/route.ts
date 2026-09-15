import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect  from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  PortfolioCreateSchema,
  PortfolioUpdateSchema,
  PORTFOLIO_IMAGE_KEYS,
  readPortfolioFromFormData,
} from "@/schemas/portfolio.schema";

const SECTION_TYPE = "portfolio";

// GET /api/sections/portfolio
export async function GET() {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
      isActive: true,
    }).lean();

    if (!section) {
      return NextResponse.json({ error: "Portfolio section not found." }, { status: 404 });
    }

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("GET /sections/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST /api/sections/portfolio
// Creates the section. Paragraph + all 6 images are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readPortfolioFromFormData(formData);

    const parsed = PortfolioCreateSchema.safeParse(raw);

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

    const content: Record<string, unknown> = { paragraph: parsed.data.paragraph };

    for (const key of PORTFOLIO_IMAGE_KEYS) {
      const imageCloud = await uploadOnCloudinary(parsed.data[key]);
      if (!imageCloud) {
        return NextResponse.json({ error: `Upload failed for ${key}.` }, { status: 502 });
      }
      content[key] = { url: imageCloud.secure_url, publicId: imageCloud.public_id };
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content,
    });

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error) {
    console.error("POST /sections/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
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
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { paragraph, ...images } = parsed.data;
    const changedImageKeys = PORTFOLIO_IMAGE_KEYS.filter((key) => images[key] !== undefined);

    if (paragraph === undefined && changedImageKeys.length === 0) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
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
        return NextResponse.json({ error: `Upload failed for ${key}.` }, { status: 502 });
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

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("PATCH /sections/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}