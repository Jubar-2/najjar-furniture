import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file already sitting on local disk (e.g. a temp file written
 * from an incoming request) to Cloudinary, then removes the local copy
 * regardless of whether the upload succeeded or failed.
 */
export async function uploadOnCloudinary(file: File): Promise<UploadApiResponse | undefined> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
}

export async function deleteUploadedFileOnCloudinary(
    publicId: string,
    resourceType: "image" | "video" | "raw" = "image"
) {
    if (!publicId) return null;

    try {
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (err) {
        console.error("Cloudinary delete failed:", err);
        return null;
    }
}