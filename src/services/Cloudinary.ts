import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Validates image buffer magic bytes to ensure file is a genuine image format
 * (WebP, JPEG, PNG, GIF, BMP, AVIF, SVG) and not a disguised/malicious upload.
 */
function isValidImageBuffer(buf: Buffer): boolean {
    if (!buf || buf.length < 12) return false;

    // WebP: starts with RIFF (bytes 0-3) and WEBP (bytes 8-11)
    if (
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    ) {
        return true;
    }

    // JPEG: starts with FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return true;
    }

    // PNG: starts with 89 50 4E 47
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return true;
    }

    // GIF: starts with GIF
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
        return true;
    }

    // BMP: starts with BM
    if (buf[0] === 0x42 && buf[1] === 0x4d) {
        return true;
    }

    // AVIF / HEIC container: bytes 4-7 are 'ftyp'
    if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
        return true;
    }

    // SVG: text header containing <svg
    const headerStr = buf.subarray(0, Math.min(buf.length, 512)).toString("utf8");
    if (headerStr.includes("<svg") || (headerStr.includes("<?xml") && headerStr.includes("<svg"))) {
        return true;
    }

    return false;
}

/**
 * Uploads an image file to Cloudinary as WebP format.
 * Rejects non-image files and validates magic bytes before upload.
 */
export async function uploadOnCloudinary(file: File): Promise<UploadApiResponse | undefined> {
    if (!file || !(file instanceof File)) {
        throw new Error("Invalid file provided for upload.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Uploaded file must be an image.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isValidImageBuffer(buffer)) {
        throw new Error("Uploaded file content does not match a valid image format.");
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                format: "webp",
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