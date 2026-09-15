import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import PageSection from "@/models/pageSections.model";
import PageModel from "@/models/page.model";
import { deleteUploadedFileOnCloudinary, uploadOnCloudinary } from "@/services/Cloudinary";
import { ApiResponse } from "@/lib/apiResponse";
import { LayerSchema } from "@/schemas/layer.schema";

const SECTION_TYPE = "home-layer-2";

// GET /api/control-panel/page/home/layer2
export async function GET() {
    try {
        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            return NextResponse.json({ error: "Home page is not found." }, { status: 404 });
        }

        const section = await PageSection.findOne({
            pageId: page._id,
            type: SECTION_TYPE,
        }).lean();

        if (!section) {
            return NextResponse.json({ error: "Layer 2 section not found." }, { status: 404 });
        }

        return NextResponse.json({ data: section }, { status: 200 });
    } catch (error) {
        console.error("GET /control-panel/page/home/layer2 failed:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}

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
            return NextResponse.json(
                { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
                { status: 422 }
            );
        }

        await dbConnect();


        const page = await PageModel.findOne({pageName: "home"});

        if (!page) {
            throw Error("Home page is not found")
        }

        const { heading, paragraph, image } = parsed.data;

        const imageCloud = await uploadOnCloudinary(image);

        const section = await PageSection.create({
            pageId: page._id,
            type: SECTION_TYPE,
            content: {
                heading,
                paragraph,
                image: imageCloud?.url
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
// Body must be a full LayerSchema payload (partial updates aren't merged).
export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();

        const rawImage = formData.get("image");
        const rawHeading = formData.get("heading");
        const rawParagraph = formData.get("paragraph");

        const parsed = LayerSchema.safeParse({
            // formData.get() returns "" for a missing text field and a zero-byte
            // File for a missing file input — normalize both to `undefined` so
            // .optional() actually treats "not sent" as "not sent".
            heading: rawHeading ? String(rawHeading) : undefined,
            paragraph: rawParagraph ? String(rawParagraph) : undefined,
            image: rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed.", issues: z.treeifyError(parsed.error) },
                { status: 422 }
            );
        }

        const { heading, paragraph, image } = parsed.data;

        if (heading === undefined && paragraph === undefined && image === undefined) {
            return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            throw new Error("Home page is not found");
        }

        const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
        if (!section) {
            return NextResponse.json({ error: "Banner section not found." }, { status: 404 });
        }

        // Merge onto the existing content rather than replacing it wholesale,
        // so a heading-only update doesn't wipe out the existing banner/paragraph.
        const updatedContent: Record<string, unknown> = { ...section.content };

        if (heading !== undefined) updatedContent.heading = heading;
        if (paragraph !== undefined) updatedContent.paragraph = paragraph;
        console.log(image)
        if (image) {
            const imageCloud = await uploadOnCloudinary(image);

            if (!imageCloud) {
                return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
            }

            // Best-effort cleanup of the old asset so replacing a banner doesn't
            // leave orphaned images sitting in your Cloudinary account. Requires
            // the previous upload's public_id to have been stored — see note below.
            const previousPublicId = (section.content as { bannerPublicId?: string }).bannerPublicId;
            if (previousPublicId) {
                await deleteUploadedFileOnCloudinary(previousPublicId, "image");
            }

            updatedContent.image = imageCloud.secure_url;
            updatedContent.imagePublicId = imageCloud.public_id;
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
