import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import Testimonial from "@/models/testimonials.model";
import { TestimonialUpdateSchema, readTestimonialFromFormData } from "@/schemas/testimonial.schema";
import { ApiResponse } from "@/lib/apiResponse";

// PATCH /api/control-panel/testimonials/:id
// Updates only the fields actually sent — name, location, message and/or
// avatar, independently of each other. An optional new avatar upload
// replaces the previous one (old Cloudinary file is deleted).
export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/control-panel/testimonials/[id]">) {
  try {
    const { id } = await params;

    const formData = await req.formData();
    const raw = readTestimonialFromFormData(formData);

    const parsed = TestimonialUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return ApiResponse.error(
        "Validation failed.",
        422,
        z.treeifyError(parsed.error)
      );
    }

    const { name, location, message, avatar } = parsed.data;
    if (name === undefined && location === undefined && message === undefined && avatar === undefined) {
      return ApiResponse.error("No fields provided to update.", 400);
    }

    await dbConnect();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return ApiResponse.error("Testimonial not found.", 404);
    }

    if (name !== undefined) testimonial.name = name;
    if (location !== undefined) testimonial.location = location;
    if (message !== undefined) testimonial.message = message;

    if (avatar) {
      const avatarCloud = await uploadOnCloudinary(avatar);
      if (!avatarCloud) {
        return ApiResponse.error("Avatar upload failed.", 502);
      }
      const previousPublicId = testimonial.avatarPublicId;
      if (previousPublicId) {
        await deleteUploadedFileOnCloudinary(previousPublicId, "image");
      }
      testimonial.avatar = avatarCloud.secure_url;
      testimonial.avatarPublicId = avatarCloud.public_id;
    }

    await testimonial.save();

    try {
      revalidateTag("testimonials", "max");
      revalidateTag("home-testimonials", "max");
      revalidateTag("home-page-data", "max");
      revalidateTag("page-sections", "max");
      revalidatePath("/");
      revalidatePath("/about-us");
    } catch (revalErr) {
      console.error("Failed to revalidate testimonials:", revalErr);
    }

    return ApiResponse.success(testimonial);
  } catch (error) {
    console.error("PATCH /testimonials/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}

// DELETE /api/control-panel/testimonials/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext<"/api/control-panel/testimonials/[id]">) {
  try {
    const { id } = await params;

    await dbConnect();

    const testimonial = await Testimonial.findByIdAndDelete(id).lean();
    if (!testimonial) {
      return ApiResponse.error("Testimonial not found.", 404);
    }

    if (testimonial.avatarPublicId) {
      await deleteUploadedFileOnCloudinary(testimonial.avatarPublicId, "image");
    }

    try {
      revalidateTag("testimonials", "max");
      revalidateTag("home-testimonials", "max");
      revalidateTag("home-page-data", "max");
      revalidateTag("page-sections", "max");
      revalidatePath("/");
      revalidatePath("/about-us");
    } catch (revalErr) {
      console.error("Failed to revalidate testimonials:", revalErr);
    }

    return ApiResponse.success({ id });
  } catch (error) {
    console.error("DELETE /testimonials/:id failed:", error);
    return ApiResponse.fatal("Something went wrong.");
  }
}