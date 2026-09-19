import { z } from "zod";

export const PageBannerCreateSchema = z.object({
  image: z.instanceof(File, { message: "Banner image must be a file." }),
  title: z.string("Title must be a string.").optional(),
  subtitle: z.string("Subtitle must be a string.").optional(),
});

export const PageBannerUpdateSchema = z.object({
  image: z.instanceof(File, { message: "Banner image must be a file." }).optional(),
  title: z.string("Title must be a string.").optional(),
  subtitle: z.string("Subtitle must be a string.").optional(),
});

export type PageBannerCreate = z.infer<typeof PageBannerCreateSchema>;
export type PageBannerUpdate = z.infer<typeof PageBannerUpdateSchema>;

export interface PageBannerData {
  image: string;
  imagePublicId?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Normalizes FormData fields into structured payload for PageBanner validation.
 */
export function readPageBannerFromFormData(formData: FormData) {
  const rawImage = formData.get("image");
  const rawTitle = formData.get("title");
  const rawSubtitle = formData.get("subtitle");

  const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;
  const title = typeof rawTitle === "string" && rawTitle.trim() ? rawTitle.trim() : undefined;
  const subtitle = typeof rawSubtitle === "string" && rawSubtitle.trim() ? rawSubtitle.trim() : undefined;

  return { image, title, subtitle };
}
