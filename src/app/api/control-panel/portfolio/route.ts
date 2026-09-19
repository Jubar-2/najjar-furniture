import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary } from "@/services/Cloudinary";
import PortfolioItem from "@/models/portfolioItem.model";
import { PortfolioItemCreateSchema, readPortfolioItemFromFormData } from "@/schemas/portfolioItem.schema";
import { ApiResponse } from "@/lib/apiResponse";

// POST /api/control-panel/portfolio
// Creates a portfolio item. Image upload is required.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = readPortfolioItemFromFormData(formData);

    const parsed = PortfolioItemCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { title, category, description, image } = parsed.data;

    const imageCloud = await uploadOnCloudinary(image);
    if (!imageCloud) {
      return ApiResponse.error("Image upload failed.", 502);
    }

    // Upload any sub-images
    const uploadedSubImages: Array<{ url: string; publicId: string }> = [];
    for (const slot of raw.subImages) {
      if (slot.file) {
        const subCloud = await uploadOnCloudinary(slot.file);
        if (subCloud) {
          uploadedSubImages.push({
            url: subCloud.secure_url,
            publicId: subCloud.public_id,
          });
        }
      }
    }

    await dbConnect();

    const item = await PortfolioItem.create({
      title,
      category: category || "",
      description,
      image: imageCloud.secure_url,
      imagePublicId: imageCloud.public_id,
      subImages: uploadedSubImages,
    });

    return ApiResponse.success(item, "Portfolio item created", 201);
  } catch (error) {
    console.error("POST /control-panel/portfolio failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}