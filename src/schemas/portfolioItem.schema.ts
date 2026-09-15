import { z } from "zod";

export const PortfolioItemCreateSchema = z.object({
  title: z.string("Title must be a string.").min(1, "Title is required."),
  category: z.string("Category must be a string.").optional(),
  description: z.string("Description must be a string.").min(1, "Description is required."),
  image: z.instanceof(File, { message: "Image must be a file." }),
});

export const PortfolioItemUpdateSchema = z.object({
  title: z.string("Title must be a string.").min(1, "Title is required.").optional(),
  category: z.string("Category must be a string.").optional(),
  description: z.string("Description must be a string.").min(1, "Description is required.").optional(),
  image: z.instanceof(File, { message: "Image must be a file." }).optional(),
});

export type PortfolioItemCreate = z.infer<typeof PortfolioItemCreateSchema>;
export type PortfolioItemUpdate = z.infer<typeof PortfolioItemUpdateSchema>;

/** Reads title / category / description / image off FormData, normalizing empty values to undefined. */
export function readPortfolioItemFromFormData(formData: FormData) {
  const rawTitle = formData.get("title");
  const rawCategory = formData.get("category");
  const rawDescription = formData.get("description");
  const rawImage = formData.get("image");

  return {
    title: rawTitle ? String(rawTitle) : undefined,
    category: rawCategory ? String(rawCategory) : undefined,
    description: rawDescription ? String(rawDescription) : undefined,
    image: rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined,
  };
}