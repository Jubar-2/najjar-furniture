import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/db/dbConnect";
import { uploadOnCloudinary, deleteUploadedFileOnCloudinary } from "@/services/Cloudinary";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import {
    GallerySchema,
    GalleryAppendSchema,
    readGalleryFromFormData,
    type GalleryImage,
} from "@/schemas/galleryImage.schema";
import { ApiResponse } from "@/lib/apiResponse";

const SECTION_TYPE = "gallery";

/** Uploads a list of files to Cloudinary in parallel, returning {url, publicId} for each. */
async function uploadMany(files: File[]): Promise<GalleryImage[] | null> {
    const results = await Promise.all(files.map((file) => uploadOnCloudinary(file)));

    if (results.some((r) => !r)) return null; // at least one upload failed

    return results.map((r) => ({ url: r!.secure_url, publicId: r!.public_id }));
}

// POST /api/sections/gallery
// Creates the gallery section. Send any number of files under repeated
// "images" and "imagesSub" fields, e.g.:
//   formData.append("images", file1); formData.append("images", file2); ...
//   formData.append("imagesSub", subFile1); formData.append("imagesSub", subFile2); ...
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const raw = readGalleryFromFormData(formData);

        const parsed = GallerySchema.safeParse(raw);

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

        const [images, imagesSub] = await Promise.all([
            uploadMany(parsed.data.images),
            uploadMany(parsed.data.imagesSub),
        ]);

        if (!images || !imagesSub) {
            return ApiResponse.error("One or more uploads failed.", 502);
        }

        const section = await PageSection.create({
            pageId: page._id,
            type: SECTION_TYPE,
            content: { images, imagesSub },
        });

        return ApiResponse.success(section, "Gallery section created", 201);
    } catch (error) {
        console.error("POST /sections/gallery failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}

// PATCH /api/sections/gallery
// Appends new images to the existing gallery — does not remove or replace
// anything already there. Send only the row(s) you're adding to.
export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();
        const raw = readGalleryFromFormData(formData);

        const parsed = GalleryAppendSchema.safeParse({
            images: raw.images.length > 0 ? raw.images : undefined,
            imagesSub: raw.imagesSub.length > 0 ? raw.imagesSub : undefined,
        });

        if (!parsed.success) {
            return ApiResponse.error(
                "Validation failed.",
                422,
                z.treeifyError(parsed.error)
            );
        }

        const { images: newImages, imagesSub: newImagesSub } = parsed.data;

        if (!newImages && !newImagesSub) {
            return ApiResponse.error(
                "No images provided — send files under \"images\" and/or \"imagesSub\".",
                400
            );
        }

        await dbConnect();

        let page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            page = await PageModel.create({
                pageName: "home",
                title: "Home page",
                meta_title: "Home",
                meta_description: "Home page",
            });
        }

        let section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
        if (!section) {
            section = await PageSection.create({
                pageId: page._id,
                type: SECTION_TYPE,
                content: { images: [], imagesSub: [] },
            });
        }

        const content = (section.content || { images: [], imagesSub: [] }) as { images: GalleryImage[]; imagesSub: GalleryImage[] };
        content.images = Array.isArray(content.images) ? content.images : [];
        content.imagesSub = Array.isArray(content.imagesSub) ? content.imagesSub : [];

        if (newImages) {
            const uploaded = await uploadMany(newImages);
            if (!uploaded) {
                return ApiResponse.error("One or more image uploads failed.", 502);
            }
            content.images = [...content.images, ...uploaded];
        }

        if (newImagesSub) {
            const uploaded = await uploadMany(newImagesSub);
            if (!uploaded) {
                return ApiResponse.error("One or more sub-image uploads failed.", 502);
            }
            content.imagesSub = [...content.imagesSub, ...uploaded];
        }

        section.content = content;
        section.markModified("content");
        await section.save();

        return ApiResponse.success(section, "Gallery updated successfully", 200);
    } catch (error) {
        console.error("PATCH /sections/gallery failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}

// DELETE /api/sections/gallery
// Removes a single image (from either row) by its Cloudinary publicId,
// passed as a query param: /api/sections/gallery?publicId=xyz&row=images
export async function DELETE(req: NextRequest) {
    try {
        const publicId = req.nextUrl.searchParams.get("publicId");
        const row = req.nextUrl.searchParams.get("row"); // "images" | "imagesSub"

        if (!publicId || (row !== "images" && row !== "imagesSub")) {
            return ApiResponse.error(
                "Query params \"publicId\" and \"row\" (images | imagesSub) are required.",
                400
            );
        }

        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" });
        if (!page) {
            return ApiResponse.error("Home page is not found.", 404);
        }

        const section = await PageSection.findOne({ pageId: page._id, type: SECTION_TYPE });
        if (!section) {
            return ApiResponse.error("Gallery section not found.", 404);
        }

        const content = section.content as { images: GalleryImage[]; imagesSub: GalleryImage[] };
        const before = content[row].length;
        content[row] = content[row].filter((img) => img.publicId !== publicId);

        if (content[row].length === before) {
            return ApiResponse.error("Image not found in that row.", 404);
        }

        await deleteUploadedFileOnCloudinary(publicId, "image");

        section.content = content;
        section.markModified("content");
        await section.save();

        return ApiResponse.success(section, "Gallery image deleted successfully", 200);
    } catch (error) {
        console.error("DELETE /sections/gallery failed:", error);
        return ApiResponse.fatal("Something went wrong.");
    }
}