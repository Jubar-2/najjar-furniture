import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary } from "@/services/Cloudinary";
import Testimonial from "@/models/testimonials.model";
import { TestimonialCreateSchema, readTestimonialFromFormData } from "@/schemas/testimonial.schema";

// GET /api/testimonials
// Lists all testimonials, most recent first.
export async function GET() {
    try {
        await dbConnect();

        const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json({ data: testimonials }, { status: 200 });
    } catch (error) {
        console.error("GET /testimonials failed:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}

// POST /api/testimonials
// Creates a testimonial. Avatar upload is optional.
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const raw = readTestimonialFromFormData(formData);

        const parsed = TestimonialCreateSchema.safeParse(raw);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
                { status: 422 }
            );
        }

        const { name, location, message, avatar } = parsed.data;

        let avatarUrl: string | undefined;

        if (avatar) {
            const avatarCloud = await uploadOnCloudinary(avatar);
            if (!avatarCloud) {
                return NextResponse.json({ error: "Avatar upload failed." }, { status: 502 });
            }
            avatarUrl = avatarCloud.secure_url;
        }

        await dbConnect();

        const testimonial = await Testimonial.create({
            name,
            location,
            message,
            avatar: avatarUrl,
        });

        return NextResponse.json({ data: testimonial }, { status: 201 });
    } catch (error) {
        console.error("POST /testimonials failed:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}