import { NextRequest, NextResponse } from "next/server";
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

const SECTION_TYPE = "about";

// GET /sections/about
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
      return NextResponse.json({ error: "About section not found." }, { status: 404 });
    }

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("GET /sections/about failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST /sections/about
// Creates the section. Paragraph + image are required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readAboutFromFormData(formData);

    const parsed = AboutCreateSchema.safeParse(raw);

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

    const imageCloud = await uploadOnCloudinary(parsed.data.image);
    if (!imageCloud) {
      return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
    }

    const section = await PageSection.create({
      pageId: page._id,
      type: SECTION_TYPE,
      content: {
        paragraph: parsed.data.paragraph,
        image: { url: imageCloud.secure_url, publicId: imageCloud.public_id },
      },
    });

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error) {
    console.error("POST /sections/about failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
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
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { paragraph, image } = parsed.data;

    if (paragraph === undefined && image === undefined) {
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

    if (image) {
      const imageCloud = await uploadOnCloudinary(image);

      if (!imageCloud) {
        return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
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

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("PATCH /sections/about failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}