import { z } from "zod";

const PortfolioImageFile = z.instanceof(File, { message: "Each portfolio image must be a file." });

export const PORTFOLIO_IMAGE_KEYS = ["image1", "image2", "image3", "image4", "image5", "image6"] as const;

// Create: paragraph + all 6 images required.
export const PortfolioCreateSchema = z.object({
  paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
  image1: PortfolioImageFile,
  image2: PortfolioImageFile,
  image3: PortfolioImageFile,
  image4: PortfolioImageFile,
  image5: PortfolioImageFile,
  image6: PortfolioImageFile,
});

// Update: everything optional — change just the paragraph, just one image,
// or any combination, without needing to resend the rest.
export const PortfolioUpdateSchema = z.object({
  paragraph: z.string("Paragraph must be a string.").min(1).optional(),
  image1: PortfolioImageFile.optional(),
  image2: PortfolioImageFile.optional(),
  image3: PortfolioImageFile.optional(),
  image4: PortfolioImageFile.optional(),
  image5: PortfolioImageFile.optional(),
  image6: PortfolioImageFile.optional(),
});

export type PortfolioCreate = z.infer<typeof PortfolioCreateSchema>;
export type PortfolioUpdate = z.infer<typeof PortfolioUpdateSchema>;

/** Reads paragraph + image1..6 off FormData, normalizing "" / zero-byte files to undefined. */
export function readPortfolioFromFormData(formData: FormData) {
  const rawParagraph = formData.get("paragraph");
  const paragraph = rawParagraph ? String(rawParagraph) : undefined;

  const images: Record<string, unknown> = {};
  for (const key of PORTFOLIO_IMAGE_KEYS) {
    const raw = formData.get(key);
    images[key] = raw instanceof File && raw.size > 0 ? raw : undefined;
  }

  return { paragraph, ...images };
}