import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageSection from "@/models/pageSections.model";
import PageModel from "@/models/page.model";
import { deleteUploadedFileOnCloudinary, uploadOnCloudinary } from "@/services/Cloudinary";
import { ApiResponse } from "@/lib/apiResponse";
import { LayerSchema, LayerUpdateSchema } from "@/schemas/layer.schema";

const SECTION_TYPE = "home-layer-2";

// POST /api/pages/:pageId/sections/banner
// Creates a new banner section for a page. Body must match LayerSchema.
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const parsed = LayerSchema.safeParse({
            image: formData.get("image"),
            heading: formData.get("heading"),
            paragraph: formData.get("paragraph"),
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });

        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const { heading, paragraph, image } = parsed.data;

        const imageCloud = await uploadOnCloudinary(image);
        if (!imageCloud) {
            return ApiResponse.error("Image upload failed.", 502);
        }

        const section = await PageSection.create({
            pageId: page._id,
            type: SECTION_TYPE,
            content: {
                heading,
                paragraph,
                image: imageCloud?.url,
                imagePublicId: imageCloud?.public_id,
            },
        });

        return ApiResponse.success(section, "Layer 2 section created", 201);
    } catch (error) {
        console.error("POST /sections/banner failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}

// PATCH /api/pages/:pageId/sections/banner
// Updates the existing banner section's content for a page.
// Body must be a full LayerSchema payload (partial updates aren't merged).
export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();

        const rawImage = formData.get("image");
        const rawHeading = formData.get("heading");
        const rawParagraph = formData.get("paragraph");

        const parsed = LayerUpdateSchema.safeParse({
            heading: rawHeading ? String(rawHeading) : undefined,
            paragraph: rawParagraph ? String(rawParagraph) : undefined,
            image: rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined,
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        const { heading, paragraph, image } = parsed.data;

        if (heading === undefined && paragraph === undefined && image === undefined) {
            return ApiResponse.error("No fields provided to update.", 400);
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
        if (!section) {
            return ApiResponse.error("Layer 2 section not found.", 404);
        }

        const updatedContent: Record<string, unknown> = { ...section.content };

        if (heading !== undefined) updatedContent.heading = heading;
        if (paragraph !== undefined) updatedContent.paragraph = paragraph;

        if (image) {
            const imageCloud = await uploadOnCloudinary(image);

            if (!imageCloud) {
                return ApiResponse.error("Image upload failed.", 502);
            }

            const previousPublicId = (section.content as { imagePublicId?: string; bannerPublicId?: string }).imagePublicId ??
                (section.content as { bannerPublicId?: string }).bannerPublicId;
            if (previousPublicId) {
                await deleteUploadedFileOnCloudinary(previousPublicId, "image");
            }

            updatedContent.image = imageCloud.secure_url;
            updatedContent.imagePublicId = imageCloud.public_id;
        }

        section.content = updatedContent;
        section.markModified("content");
        await section.save();

        return ApiResponse.success(section);
    } catch (error) {
        console.error("PATCH /sections/banner failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}
