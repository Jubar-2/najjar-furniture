import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PortfolioItem from "@/models/portfolioItem.model";
import { PortfolioItemUpdateSchema, readPortfolioItemFromFormData } from "@/schemas/portfolioItem.schema";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";

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
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { title, category, description, image } = parsed.data;
    if (
      title === undefined &&
      category === undefined &&
      description === undefined &&
      image === undefined &&
      !raw.hasSubImages
    ) {
      return ApiResponse.error("No fields provided to update.", 400);
    }

    await dbConnect();

    const item = await PortfolioItem.findById(id);
    if (!item) {
      return ApiResponse.error("Portfolio item not found.", 404);
    }

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;

    if (image) {
      const imageCloud = await uploadOnCloudinary(image);
      if (!imageCloud) {
        return ApiResponse.error("Image upload failed.", 502);
      }
      const previousPublicId = item.imagePublicId as string | undefined;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }
      item.image = imageCloud.secure_url;
      item.imagePublicId = imageCloud.public_id;
    }

    // Handle sub-images update
    if (raw.hasSubImages) {
      const currentSubImages = item.subImages || [];
      const updatedSubImages: Array<{ url: string; publicId: string }> = [];

      for (let i = 0; i < 3; i++) {
        const slot = raw.subImages[i];
        if (slot?.file) {
          const subCloud = await uploadOnCloudinary(slot.file);
          if (subCloud) {
            // Delete replaced old image if it existed
            const oldPublicId = currentSubImages[i]?.publicId;
            if (oldPublicId) {
              await deleteUploadedFileOnCloudinary(oldPublicId, "image");
            }
            updatedSubImages.push({
              url: subCloud.secure_url,
              publicId: subCloud.public_id,
            });
          }
        } else if (slot?.url) {
          const existing =
            currentSubImages.find((s) => s.url === slot.url) ||
            currentSubImages[i] || { url: slot.url, publicId: "" };
          updatedSubImages.push({
            url: existing.url,
            publicId: existing.publicId || "",
          });
        } else {
          // Slot was removed
          const oldPublicId = currentSubImages[i]?.publicId;
          if (oldPublicId) {
            await deleteUploadedFileOnCloudinary(oldPublicId, "image");
          }
        }
      }

      item.subImages = updatedSubImages;
    }

    await item.save();

    try {
      revalidateTag("portfolio-items", "max");
      revalidatePath("/portfolio");
    } catch (revalErr) {
      console.error("Failed to revalidate /portfolio:", revalErr);
    }

    return ApiResponse.success(item);
  } catch (error) {
    console.error("PATCH /control-panel/portfolio/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// DELETE /api/control-panel/portfolio/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext<"/api/control-panel/portfolio/[id]">) {
  try {
    const { id } = await params;

    await dbConnect();

    const item = await PortfolioItem.findByIdAndDelete(id).lean();
    if (!item) {
      return ApiResponse.error("Portfolio item not found.", 404);
    }

    if (item.imagePublicId) {
      await deleteUploadedFileOnCloudinary(item.imagePublicId, "image");
    }

    if (Array.isArray(item.subImages)) {
      for (const sub of item.subImages) {
        if (sub && sub.publicId) {
          await deleteUploadedFileOnCloudinary(sub.publicId, "image");
        }
      }
    }

    try {
      revalidateTag("portfolio-items", "max");
      revalidatePath("/portfolio");
    } catch (revalErr) {
      console.error("Failed to revalidate /portfolio:", revalErr);
    }

    return ApiResponse.success({ id });
  } catch (error) {
    console.error("DELETE /control-panel/portfolio/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}