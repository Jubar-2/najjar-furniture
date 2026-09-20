/**
 * Utility functions for image optimization, responsive sizing, and Cloudinary CDN URL manipulation.
 */

interface CloudinaryOptions {
    width?: number;
    height?: number;
    quality?: string | number | false; // default "auto"
    format?: string | false; // default "auto" (serves webp/avif)
    crop?: string; // default "limit" if width/height specified
    dpr?: number | string;
}

const CLOUDINARY_TRANSFORM_RE = /^(?:[whcqfbeozarg]|dpr|co|fl|pg)_[^/]+/;

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters (format auto, quality auto, dimensions).
 * If the URL is not a Cloudinary image URL, it is returned unchanged.
 */
export function optimizeCloudinaryUrl(url?: string | null, options: CloudinaryOptions = {}): string {
    if (!url || typeof url !== "string") return "";
    if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
        return url;
    }

    const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/);
    if (!match) return url;

    const [, prefix, rest] = match;
    const parts = rest.split("/");

    // If there is already an existing transformation segment at the beginning, strip it so we don't stack duplicates
    if (parts.length > 1 && CLOUDINARY_TRANSFORM_RE.test(parts[0])) {
        parts.shift();
    }

    const cleanPath = parts.join("/");

    const transforms: string[] = [];

    // Automatic modern format delivery (WebP, AVIF depending on browser Accept header)
    if (options.format !== false) {
        transforms.push(options.format ? `f_${options.format}` : "f_auto");
    }

    // Automatic perceptual compression
    if (options.quality !== false) {
        transforms.push(options.quality ? `q_${options.quality}` : "q_auto");
    }

    if (options.width) {
        transforms.push(`w_${options.width}`);
    }

    if (options.height) {
        transforms.push(`h_${options.height}`);
    }

    if (options.dpr) {
        transforms.push(`dpr_${options.dpr}`);
    }

    if (options.crop) {
        transforms.push(`c_${options.crop}`);
    } else if (options.width || options.height) {
        transforms.push("c_limit");
    }

    const transformStr = transforms.join(",");
    return `${prefix}${transformStr}/${cleanPath}`;
}

/**
 * Generates a responsive srcset string for a Cloudinary image across multiple specified widths.
 */
export function getCloudinarySrcSet(url?: string | null, widths: number[] = [480, 768, 1024, 1200]): string | undefined {
    if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
        return undefined;
    }

    return widths
        .map((w) => `${optimizeCloudinaryUrl(url, { width: w })} ${w}w`)
        .join(", ");
}
