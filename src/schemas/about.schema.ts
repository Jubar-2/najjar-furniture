import { z } from "zod";

const AboutImageFile = z.instanceof(File, { message: "The about image must be a file." });

// Create: paragraph + image required.
export const AboutCreateSchema = z.object({
  paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
  image: AboutImageFile,
});

// Update: everything optional — change just the paragraph, just the image,
// or both, without needing to resend the rest.
export const AboutUpdateSchema = z.object({
  paragraph: z.string("Paragraph must be a string.").min(1).optional(),
  image: AboutImageFile.optional(),
});

export type AboutCreate = z.infer<typeof AboutCreateSchema>;
export type AboutUpdate = z.infer<typeof AboutUpdateSchema>;

/** Reads paragraph + image off FormData, normalizing "" / zero-byte files to undefined. */
export function readAboutFromFormData(formData: FormData) {
  const rawParagraph = formData.get("paragraph");
  const paragraph = rawParagraph ? String(rawParagraph) : undefined;

  const rawImage = formData.get("image");
  const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

  return { paragraph, image };
}