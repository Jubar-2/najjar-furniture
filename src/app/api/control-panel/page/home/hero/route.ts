import { NextRequest, NextResponse } from "next/server";
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
            return NextResponse.json(
                { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
                { status: 422 }
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
            throw Error("Home page is not found")
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

        return ApiResponse.success({ data: section });
    } catch (error) {
        console.error("POST /sections/banner failed:", error);
        return ApiResponse.error("Something went wrong.", 500);
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
            // formData.get() returns "" for a missing text field and a zero-byte
            // File for a missing file input — normalize both to `undefined` so
            // .optional() actually treats "not sent" as "not sent".
            heading: rawHeading ? String(rawHeading) : undefined,
            paragraph: rawParagraph ? String(rawParagraph) : undefined,
            banner: rawBanner instanceof File && rawBanner.size > 0 ? rawBanner : undefined,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
                { status: 422 }
            );
        }

        const { heading, paragraph, banner } = parsed.data;

        if (heading === undefined && paragraph === undefined && banner === undefined) {
            return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            throw new Error("Home page is not found");
        }

        const section = await PageSection.findOne({ pageId: page._id, type: "banner" });
        if (!section) {
            return NextResponse.json({ error: "Banner section not found." }, { status: 404 });
        }

        // Merge onto the existing content rather than replacing it wholesale,
        // so a heading-only update doesn't wipe out the existing banner/paragraph.
        const updatedContent: Record<string, unknown> = { ...section.content };

        if (heading !== undefined) updatedContent.heading = heading;
        if (paragraph !== undefined) updatedContent.paragraph = paragraph;
        console.log(banner)
        if (banner) {
            const bannerCloud = await uploadOnCloudinary(banner);

            if (!bannerCloud) {
                return NextResponse.json({ error: "Banner upload failed." }, { status: 502 });
            }

            // Best-effort cleanup of the old asset so replacing a banner doesn't
            // leave orphaned images sitting in your Cloudinary account. Requires
            // the previous upload's public_id to have been stored — see note below.
            const previousPublicId = (section.content as { bannerPublicId?: string }).bannerPublicId;
            if (previousPublicId) {
                await deleteUploadedFileOnCloudinary(previousPublicId, "image");
            }

            updatedContent.banner = bannerCloud.secure_url;
            updatedContent.bannerPublicId = bannerCloud.public_id;
        }

        section.content = updatedContent;
        section.markModified("content"); // Mixed fields need this — Mongoose won't
        // detect in-place mutations otherwise.
        await section.save();

        return NextResponse.json({ data: section }, { status: 200 });
    } catch (error) {
        console.error("PATCH /sections/banner failed:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
