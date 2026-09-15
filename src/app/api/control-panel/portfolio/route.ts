import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary } from "@/services/Cloudinary";
import PortfolioItem from "@/models/portfolioItem.model";
import { PortfolioItemCreateSchema, readPortfolioItemFromFormData } from "@/schemas/portfolioItem.schema";

// GET /api/control-panel/portfolio
// Lists all portfolio items, most recent first.
export async function GET() {
  try {
    await dbConnect();

    const items = await PortfolioItem.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error("GET /control-panel/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// POST /api/control-panel/portfolio
// Creates a portfolio item. Image upload is required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readPortfolioItemFromFormData(formData);

    const parsed = PortfolioItemCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
        { status: 422 }
      );
    }

    const { title, category, description, image } = parsed.data;

    const imageCloud = await uploadOnCloudinary(image);
    if (!imageCloud) {
      return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
    }

    await dbConnect();

    const item = await PortfolioItem.create({
      title,
      category: category || "",
      description,
      image: imageCloud.secure_url,
      imagePublicId: imageCloud.public_id,
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error("POST /control-panel/portfolio failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}