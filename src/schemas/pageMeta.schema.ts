import { z } from "zod";

export const PageMetaSchema = z.object({
  title: z.string("Title must be a string.").max(255).optional(),
  meta_title: z.string("Meta title must be a string.").max(255).optional(),
  meta_description: z.string("Meta description must be a string.").optional(),
  meta_keywords: z.string("Meta keywords must be a string.").optional(),
  meta_og_image: z.string("OG image must be a string.").optional(),
  meta_author: z.string("Author must be a string.").optional(),
});

export type PageMeta = z.infer<typeof PageMetaSchema>;

/** Reads the meta field(s) off an incoming JSON body, normalizing empty strings to undefined. */
export function readPageMetaFromJson(json: Record<string, unknown>) {
  const pick = (key: string) => {
    const value = json[key];
    return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
  };

  return {
    title: pick("title"),
    meta_title: pick("meta_title"),
    meta_description: pick("meta_description"),
    meta_keywords: pick("meta_keywords"),
    meta_og_image: pick("meta_og_image"),
    meta_author: pick("meta_author"),
  };
}