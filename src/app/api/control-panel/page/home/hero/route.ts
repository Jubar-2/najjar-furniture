import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageSection from "@/models/pageSections.model";
import PageModel from "@/models/page.model";
import { HeroSchema, HeroUpdatedSchema } from "@/schemas/hero.schema";
import { deleteUploadedFileOnCloudinary, uploadOnCloudinary } from "@/services/Cloudinary";
import { ApiResponse } from "@/lib/apiResponse";
import { revalidatePath, revalidateTag } from "next/cache";

// POST /api/control-panel/page/home/hero
// Creates a new banner section for a page. Body must match HeroSchema.
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const rawShowWhatsApp = formData.get("showWhatsApp");
        const rawShowSocials = formData.get("showSocials");

        const parsed = HeroSchema.safeParse({
            banner: formData.get("banner"),
            heading: formData.get("heading"),
            paragraph: formData.get("paragraph"),
            whatsAppNumber: formData.get("whatsAppNumber")?.toString(),
            ctaLabel: formData.get("ctaLabel")?.toString(),
            showWhatsApp: rawShowWhatsApp !== null ? rawShowWhatsApp === "true" || rawShowWhatsApp === "1" : undefined,
            showSocials: rawShowSocials !== null ? rawShowSocials === "true" || rawShowSocials === "1" : undefined,
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        await dbConnect();

        let page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            page = await PageModel.create({
                pageName: "home",
                title: "Home page",
                meta_title: "Najjar Furniture",
                meta_description: "Timeless Furniture, Thoughtfully Crafted."
            });
        }

        const { heading, paragraph, banner, whatsAppNumber, ctaLabel, showWhatsApp, showSocials } = parsed.data;

        const bannerCloud = await uploadOnCloudinary(banner);

        const section = await PageSection.create({
            pageId: page._id,
            type: "banner",
            content: {
                heading,
                paragraph,
                banner: bannerCloud?.secure_url || bannerCloud?.url,
                bannerPublicId: bannerCloud?.public_id,
                whatsAppNumber: whatsAppNumber ?? "",
                ctaLabel: ctaLabel ?? "Chat on WhatsApp",
                showWhatsApp: showWhatsApp ?? true,
                showSocials: showSocials ?? true,
            },
        });

        try {
            revalidateTag("home-page-data", "max");
            revalidateTag("page-sections", "max");
            revalidatePath("/");
        } catch (revalErr) {
            console.error("Revalidation failed:", revalErr);
        }

        return ApiResponse.success(section, "Hero banner created", 201);
    } catch (error) {
        console.error("POST /sections/banner failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}

// PATCH /api/control-panel/page/home/hero
// Updates the existing banner section's content for a page.
export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();

        const rawBanner = formData.get("banner");
        const rawHeading = formData.get("heading");
        const rawParagraph = formData.get("paragraph");
        const rawWhatsAppNumber = formData.get("whatsAppNumber");
        const rawCtaLabel = formData.get("ctaLabel");
        const rawShowWhatsApp = formData.get("showWhatsApp");
        const rawShowSocials = formData.get("showSocials");

        const parsed = HeroUpdatedSchema.safeParse({
            heading: rawHeading !== null ? String(rawHeading) : undefined,
            paragraph: rawParagraph !== null ? String(rawParagraph) : undefined,
            banner: rawBanner instanceof File && rawBanner.size > 0 ? rawBanner : undefined,
            whatsAppNumber: rawWhatsAppNumber !== null ? String(rawWhatsAppNumber).trim() : undefined,
            ctaLabel: rawCtaLabel !== null ? String(rawCtaLabel).trim() : undefined,
            showWhatsApp: rawShowWhatsApp !== null ? rawShowWhatsApp === "true" || rawShowWhatsApp === "1" : undefined,
            showSocials: rawShowSocials !== null ? rawShowSocials === "true" || rawShowSocials === "1" : undefined,
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        const { heading, paragraph, banner, whatsAppNumber, ctaLabel, showWhatsApp, showSocials } = parsed.data;

        if (
            heading === undefined &&
            paragraph === undefined &&
            banner === undefined &&
            whatsAppNumber === undefined &&
            ctaLabel === undefined &&
            showWhatsApp === undefined &&
            showSocials === undefined
        ) {
            return ApiResponse.error("No fields provided to update.", 400);
        }

        await dbConnect();

        let page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            page = await PageModel.create({
                pageName: "home",
                title: "Home page",
                meta_title: "Najjar Furniture",
                meta_description: "Timeless Furniture, Thoughtfully Crafted."
            });
        }

        let section = await PageSection.findOne({ pageId: page._id, type: "banner" });
        if (!section) {
            section = await PageSection.create({
                pageId: page._id,
                type: "banner",
                content: {},
            });
        }

        const updatedContent: Record<string, unknown> = { ...(section.content || {}) };

        if (heading !== undefined) updatedContent.heading = heading;
        if (paragraph !== undefined) updatedContent.paragraph = paragraph;
        if (whatsAppNumber !== undefined) updatedContent.whatsAppNumber = whatsAppNumber;
        if (ctaLabel !== undefined) updatedContent.ctaLabel = ctaLabel;
        if (showWhatsApp !== undefined) updatedContent.showWhatsApp = showWhatsApp;
        if (showSocials !== undefined) updatedContent.showSocials = showSocials;

        if (banner) {
            const bannerCloud = await uploadOnCloudinary(banner);

            if (!bannerCloud) {
                return ApiResponse.error("Banner upload failed.", 502);
            }

            const previousPublicId = (section.content as { bannerPublicId?: string })?.bannerPublicId;
            if (previousPublicId) {
                await deleteUploadedFileOnCloudinary(previousPublicId, "image");
            }

            updatedContent.banner = bannerCloud.secure_url;
            updatedContent.bannerPublicId = bannerCloud.public_id;
        }

        section.content = updatedContent;
        section.markModified("content");
        await section.save();

        try {
            revalidateTag("home-page-data", "max");
            revalidateTag("page-sections", "max");
            revalidatePath("/");
        } catch (revalErr) {
            console.error("Revalidation failed:", revalErr);
        }

        return ApiResponse.success(section);
    } catch (error) {
        console.error("PATCH /sections/banner failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}
