import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
  GallerySchema,
  GalleryAppendSchema,
  readGalleryFromFormData,
  type GalleryImage,
} from "@/schemas/galleryImage.schema";

const SECTION_TYPE = "gallery";

/** Helper to ensure the "home" page exists in MongoDB */
async function getOrCreateHomePage() {
  let page = await PageModel.findOne({ pageName: "home" });
  if (!page) {
    page = await PageModel.create({
      pageName: "home",
      title: "Home page",
      meta_title: "Home",
      meta_description: "Najjar Furniture Home Page",
    });
  }
  return page;
}

/** Uploads a list of files to Cloudinary in parallel, returning {url, publicId} for each. */
async function uploadMany(files: File[]): Promise<GalleryImage[] | null> {
  const results = await Promise.all(files.map((file) => uploadOnCloudinary(file)));

  if (results.some((r) => !r || !r.secure_url || !r.public_id)) return null;

  return results.map((r) => ({ url: r!.secure_url, publicId: r!.public_id }));
}

// GET /api/control-panel/page/home/gallery
// Returns the gallery section (both image rows) for the home page.
export async function GET() {
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json(
        { data: { content: { images: [], imagesSub: [] } } },
        { status: 200 }
      );
    }

    const section = await PageSection.findOne({
      pageId: page._id,
      type: SECTION_TYPE,
      isActive: true,
    }).lean();

    if (!section || !section.content) {
      return NextResponse.json(
        { data: { content: { images: [], imagesSub: [] } } },
        { status: 200 }
      );
    }

    const content = section.content as { images?: GalleryImage[]; imagesSub?: GalleryImage[] };

    return NextResponse.json(
      {
        data: {
          ...section,
          content: {
            images: content.images || [],
            imagesSub: content.imagesSub || [],
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/control-panel/page/home/gallery failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST /api/control-panel/page/home/gallery
// Creates or completely replaces the gallery section images.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readGalleryFromFormData(formData);

    const parsed = GallerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    await dbConnect();
    const page = await getOrCreateHomePage();

    const [images, imagesSub] = await Promise.all([
      uploadMany(parsed.data.images),
      uploadMany(parsed.data.imagesSub),
    ]);

    if (!images || !imagesSub) {
      return NextResponse.json({ error: "One or more uploads failed." }, { status: 502 });
    }

    let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (section) {
      section.content = { images, imagesSub };
      section.markModified("content");
      await section.save();
    } else {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: { images, imagesSub },
      });
    }

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error) {
    console.error("POST /api/control-panel/page/home/gallery failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/control-panel/page/home/gallery
// Appends new images to the existing gallery (or creates it if not yet existing).
// Accepts files under "images" and/or "imagesSub".
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readGalleryFromFormData(formData);

    const parsed = GalleryAppendSchema.safeParse({
      images: raw.images.length > 0 ? raw.images : undefined,
      imagesSub: raw.imagesSub.length > 0 ? raw.imagesSub : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { images: newImages, imagesSub: newImagesSub } = parsed.data;

    if (!newImages && !newImagesSub) {
      return NextResponse.json(
        { error: 'No images provided — send files under "images" and/or "imagesSub".' },
        { status: 400 }
      );
    }

    await dbConnect();
    const page = await getOrCreateHomePage();

    let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      section = await PageSection.create({
        pageId: page._id,
        type: SECTION_TYPE,
        content: { images: [], imagesSub: [] },
      });
    }

    const content = (section.content || {}) as { images?: GalleryImage[]; imagesSub?: GalleryImage[] };
    const currentImages = Array.isArray(content.images) ? content.images : [];
    const currentImagesSub = Array.isArray(content.imagesSub) ? content.imagesSub : [];

    if (newImages && newImages.length > 0) {
      const uploaded = await uploadMany(newImages);
      if (!uploaded) {
        return NextResponse.json({ error: "One or more image uploads failed." }, { status: 502 });
      }
      content.images = [...currentImages, ...uploaded];
    } else {
      content.images = currentImages;
    }

    if (newImagesSub && newImagesSub.length > 0) {
      const uploaded = await uploadMany(newImagesSub);
      if (!uploaded) {
        return NextResponse.json({ error: "One or more sub-image uploads failed." }, { status: 502 });
      }
      content.imagesSub = [...currentImagesSub, ...uploaded];
    } else {
      content.imagesSub = currentImagesSub;
    }

    section.content = content;
    section.markModified("content");
    await section.save();

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/control-panel/page/home/gallery failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE /api/control-panel/page/home/gallery
// Removes a single image (from either row) by its Cloudinary publicId:
// /api/control-panel/page/home/gallery?publicId=xyz&row=images
export async function DELETE(req: NextRequest) {
  try {
    const publicId = req.nextUrl.searchParams.get("publicId");
    const row = req.nextUrl.searchParams.get("row"); // "images" | "imagesSub"

    if (!publicId || (row !== "images" && row !== "imagesSub")) {
      return NextResponse.json(
        { error: 'Query params "publicId" and "row" (images | imagesSub) are required.' },
        { status: 400 }
      );
    }

    await dbConnect();
    const page = await PageModel.findOne({ pageName: "home" });
    if (!page) {
      return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
    }

    const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    const content = (section.content || {}) as { images?: GalleryImage[]; imagesSub?: GalleryImage[] };
    const rowItems = Array.isArray(content[row]) ? content[row] : [];
    const before = rowItems.length;
    content[row] = rowItems.filter((img) => img.publicId !== publicId);

    if (content[row].length === before) {
      return NextResponse.json({ error: "Image not found in that row." }, { status: 404 });
    }

    await deleteUploadedFileOnCloudinary(publicId, "image");

    section.content = content;
    section.markModified("content");
    await section.save();

    return NextResponse.json({ data: section }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/control-panel/page/home/gallery failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
