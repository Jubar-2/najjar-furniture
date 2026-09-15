import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PortfolioItem from "@/models/portfolioItem.model";
import { PortfolioItemUpdateSchema, readPortfolioItemFromFormData } from "@/schemas/portfolioItem.schema";

// PATCH /api/control-panel/portfolio/:id
// Updates only the fields actually sent — title, category, description
// and/or image, independently of each other. An optional new image upload
// replaces the previous one (old Cloudinary file is deleted).
export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/control-panel/portfolio/[id]">) {
  try {
    const { id } = await params;

    const formData = await req.formData();
    const raw = readPortfolioItemFromFormData(formData);

    const parsed = PortfolioItemUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { title, category, description, image } = parsed.data;
    if (title === undefined && category === undefined && description === undefined && image === undefined) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    await dbConnect();

    const item = await PortfolioItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
    }

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;

    if (image) {
      const imageCloud = await uploadOnCloudinary(image);
      if (!imageCloud) {
        return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
      }
      const previousPublicId = item.imagePublicId as string | undefined;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }
      item.image = imageCloud.secure_url;
      item.imagePublicId = imageCloud.public_id;
    }

    await item.save();

    return NextResponse.json({ data: item }, { status: 200 });
  } catch (error) {
    console.error("PATCH /control-panel/portfolio/:id failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE /api/control-panel/portfolio/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext<"/api/control-panel/portfolio/[id]">) {
  try {
    const { id } = await params;

    await dbConnect();

    const item = await PortfolioItem.findByIdAndDelete(id).lean();
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
    }

    if (item.imagePublicId) {
      await deleteUploadedFileOnCloudinary(item.imagePublicId, "image");
    }

    return NextResponse.json({ data: { id } }, { status: 200 });
  } catch (error) {
    console.error("DELETE /control-panel/portfolio/:id failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}