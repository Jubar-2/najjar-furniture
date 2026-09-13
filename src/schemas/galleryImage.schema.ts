import { z } from "zod";

const GalleryImageFile = z.instanceof(File, { message: "Each gallery item must be a file." });

// Unlimited count on both — no fixed number of images or sub-images,
// unlike the 6-item home-layer-three section.
export const GallerySchema = z.object({
  images: z.array(GalleryImageFile).min(1, "At least one image is required."),
  imagesSub: z.array(GalleryImageFile).min(1, "At least one sub image is required."),
});

// For appending more images to an existing gallery — both arrays optional
// since you might only be adding to one row at a time, but at least one
// of the two must be present (checked in the route, not here).
export const GalleryAppendSchema = z.object({
  images: z.array(GalleryImageFile).optional(),
  imagesSub: z.array(GalleryImageFile).optional(),
});

export type Gallery = z.infer<typeof GallerySchema>;
export type GalleryAppend = z.infer<typeof GalleryAppendSchema>;

export interface GalleryImage {
  url: string;
  publicId: string;
}

/**
 * formData.getAll("images") returns every file uploaded under that field
 * name, in order — this is what makes the count unbounded. A single File
 * input with `multiple` (or several inputs sharing the same `name`) both
 * work fine with getAll(); a single unfilled file input still yields
 * nothing (not a zero-byte File), so no extra normalization is needed
 * here the way single-file routes needed for "" vs zero-byte File.
 */
export function readGalleryFromFormData(formData: FormData) {
  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const imagesSub = formData
    .getAll("imagesSub")
    .filter((f): f is File => f instanceof File && f.size > 0);

  return { images, imagesSub };
}