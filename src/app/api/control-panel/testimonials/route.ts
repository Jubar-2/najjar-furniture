import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary } from "@/services/Cloudinary";
import Testimonial from "@/models/testimonials.model";
import { TestimonialCreateSchema, readTestimonialFromFormData } from "@/schemas/testimonial.schema";
import { ApiResponse } from "@/lib/apiResponse";

// POST /api/control-panel/testimonials
// Creates a testimonial. Avatar upload is optional.
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const raw = readTestimonialFromFormData(formData);

        const parsed = TestimonialCreateSchema.safeParse(raw);

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        const { name, location, message, avatar } = parsed.data;

        let avatarUrl: string | undefined;
        let avatarPublicId: string | undefined;

        if (avatar) {
            const avatarCloud = await uploadOnCloudinary(avatar);
            if (!avatarCloud) {
                return ApiResponse.error("Avatar upload failed.", 502);
            }
            avatarUrl = avatarCloud.secure_url;
            avatarPublicId = avatarCloud.public_id;
        }

        await dbConnect();

        const testimonial = await Testimonial.create({
            name,
            location,
            message,
            avatar: avatarUrl,
            avatarPublicId,
        });

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

        return ApiResponse.success(testimonial, "Testimonial created", 201);
    } catch (error) {
        console.error("POST /testimonials failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}