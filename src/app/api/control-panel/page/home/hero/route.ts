import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageSection from "@/models/pageSections.model";
import PageModel from "@/models/page.model";
import { HeroSchema, HeroUpdatedSchema } from "@/schemas/hero.schema";
import { deleteUploadedFileOnCloudinary, uploadOnCloudinary } from "@/services/Cloudinary";
import { ApiResponse } from "@/lib/apiResponse";

// POST /api/pages/:pageId/sections/banner
// Creates a new banner section for a page. Body must match HeroSchema.
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const parsed = HeroSchema.safeParse({
            banner: formData.get("banner"),
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

        const page = await PageModel.create({
            pageName: "home",
            title: "Home page",
            meta_title: "meta title",
            meta_description: "meta description"
        });

        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const { heading, paragraph, banner } = parsed.data;

        const bannerCloud = await uploadOnCloudinary(banner);

        const section = await PageSection.create({
            pageId: page._id,
            type: "banner",
            content: {
                heading,
                paragraph,
                banner: bannerCloud?.url
            },
        });

        return ApiResponse.success(section, "Hero banner created", 201);
    } catch (error) {
        console.error("POST /sections/banner failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}

// PATCH /api/pages/:pageId/sections/banner
// Updates the existing banner section's content for a page.
// Body must be a full HeroSchema payload (partial updates aren't merged).
export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();

        const rawBanner = formData.get("banner");
        const rawHeading = formData.get("heading");
        const rawParagraph = formData.get("paragraph");

        const parsed = HeroUpdatedSchema.safeParse({
            heading: rawHeading ? String(rawHeading) : undefined,
            paragraph: rawParagraph ? String(rawParagraph) : undefined,
            banner: rawBanner instanceof File && rawBanner.size > 0 ? rawBanner : undefined,
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        const { heading, paragraph, banner } = parsed.data;

        if (heading === undefined && paragraph === undefined && banner === undefined) {
            return ApiResponse.error("No fields provided to update.", 400);
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const section = await PageSection.findOne({ pageId: page._id, type: "banner" });
        if (!section) {
            return ApiResponse.error("Banner section not found.", 404);
        }

        const updatedContent: Record<string, unknown> = { ...section.content };

        if (heading !== undefined) updatedContent.heading = heading;
        if (paragraph !== undefined) updatedContent.paragraph = paragraph;

        if (banner) {
            const bannerCloud = await uploadOnCloudinary(banner);

            if (!bannerCloud) {
                return ApiResponse.error("Banner upload failed.", 502);
            }

            const previousPublicId = (section.content as { bannerPublicId?: string }).bannerPublicId;
            if (previousPublicId) {
                await deleteUploadedFileOnCloudinary(previousPublicId, "image");
            }

            updatedContent.banner = bannerCloud.secure_url;
            updatedContent.bannerPublicId = bannerCloud.public_id;
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
