import { z } from "zod";

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB (Netlify payload limit protection)

export const ImageFileSchema = z
  .instanceof(File, { message: "Image must be a file." })
  .refine((file) => file.size > 0, { message: "Image file cannot be empty." })
  .refine((file) => file.size <= MAX_FILE_SIZE, { message: "Image must be less than 6MB." })
  .refine((file) => file.type.startsWith("image/"), { message: "File must be an image." });

export const HomeLayerItemSchema = z.object({
  heading: z.string("Heading must be a string.").min(1, "Heading is required."),
  paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
  image: ImageFileSchema,
});

// Create: all 6 items required, every field within each item required.
export const HomeLayerThreeSchema = z.object({
  item1: HomeLayerItemSchema,
  item2: HomeLayerItemSchema,
  item3: HomeLayerItemSchema,
  item4: HomeLayerItemSchema,
  item5: HomeLayerItemSchema,
  item6: HomeLayerItemSchema,
});

// Update: each item is optional. When updating an item, any of its fields
// (heading, paragraph, or image) can be updated independently without requiring
// re-uploading untouched images or resending identical fields.
export const HomeLayerItemUpdateSchema = z
  .object({
    heading: z.string("Heading must be a string.").min(1, "Heading cannot be empty.").optional(),
    paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph cannot be empty.").optional(),
    image: ImageFileSchema.optional(),
  })
  .refine(
    (data) => data.heading !== undefined || data.paragraph !== undefined || data.image !== undefined,
    { message: "At least one field must be provided for the item." }
  );

export const HomeLayerThreeUpdateSchema = z.object({
  item1: HomeLayerItemUpdateSchema.optional(),
  item2: HomeLayerItemUpdateSchema.optional(),
  item3: HomeLayerItemUpdateSchema.optional(),
  item4: HomeLayerItemUpdateSchema.optional(),
  item5: HomeLayerItemUpdateSchema.optional(),
  item6: HomeLayerItemUpdateSchema.optional(),
});

export type HomeLayerThree = z.infer<typeof HomeLayerThreeSchema>;
export type HomeLayerThreeUpdate = z.infer<typeof HomeLayerThreeUpdateSchema>;

export const HOME_LAYER_THREE_KEYS = [
  "item1",
  "item2",
  "item3",
  "item4",
  "item5",
  "item6",
] as const;

function getFormField(formData: FormData, ...names: string[]) {
  for (const name of names) {
    const val = formData.get(name);
    if (val !== null && val !== undefined) return val;
  }
  return null;
}

/**
 * Reads image{N}/heading{N}/paragraph{N} (N = 1..6) or item{N}[field] off incoming FormData
 * and reshapes them into { item1: {...}, item2: {...}, ... } so they match
 * the nested schemas above.
 *
 * `requireAll`:
 *   - true  (POST/create): every item key is always included, even if empty
 *            — missing required fields, so Zod's own validation reports it.
 *   - false (PATCH/update): an item key is only included if at least one of
 *            its fields was actually sent, so untouched items are left
 *            out entirely rather than failing validation.
 */
export function readHomeLayerThreeFromFormData(formData: FormData, requireAll: boolean) {
  const items: Record<string, unknown> = {};

  for (const key of HOME_LAYER_THREE_KEYS) {
    const index = key.replace("item", "");

    // Check if the item was passed as a JSON string
    const rawItemJson = formData.get(key);
    let itemObj: Record<string, unknown> | null = null;
    if (typeof rawItemJson === "string") {
      try {
        const parsed = JSON.parse(rawItemJson);
        if (typeof parsed === "object" && parsed !== null) {
          itemObj = parsed as Record<string, unknown>;
        }
      } catch {
        // not JSON
      }
    }

    const rawImage = getFormField(
      formData,
      `image${index}`,
      `image_${index}`,
      `image[${index}]`,
      `${key}[image]`,
      `${key}.image`
    );
    const rawHeading = getFormField(
      formData,
      `heading${index}`,
      `heading_${index}`,
      `heading[${index}]`,
      `${key}[heading]`,
      `${key}.heading`
    );
    const rawParagraph = getFormField(
      formData,
      `paragraph${index}`,
      `paragraph_${index}`,
      `paragraph[${index}]`,
      `${key}[paragraph]`,
      `${key}.paragraph`
    );

    const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;
    const heading = rawHeading !== null && rawHeading !== "" ? String(rawHeading) : (itemObj?.heading ? String(itemObj.heading) : undefined);
    const paragraph = rawParagraph !== null && rawParagraph !== "" ? String(rawParagraph) : (itemObj?.paragraph ? String(itemObj.paragraph) : undefined);

    const hasAnyField = image !== undefined || heading !== undefined || paragraph !== undefined;

    if (requireAll || hasAnyField) {
      items[key] = { image, heading, paragraph };
    }
  }

  return items;
}

/**
 * Reads a single item's heading, paragraph, and image from FormData.
 * Supports field names with or without item index:
 *   heading / heading1 / heading_1 / item1[heading]
 *   paragraph / paragraph1 / paragraph_1 / item1[paragraph]
 *   image / image1 / image_1 / item1[image]
 */
export function readSingleLayerItemFromFormData(formData: FormData, index?: string | number) {
  const idx = index ? String(index).replace("item", "") : "";
  const key = idx ? `item${idx}` : "";

  const rawImage = getFormField(
    formData,
    "image",
    ...(idx
      ? [
          `image${idx}`,
          `image_${idx}`,
          `image[${idx}]`,
          `${key}[image]`,
          `${key}.image`,
        ]
      : [])
  );
  const rawHeading = getFormField(
    formData,
    "heading",
    ...(idx
      ? [
          `heading${idx}`,
          `heading_${idx}`,
          `heading[${idx}]`,
          `${key}[heading]`,
          `${key}.heading`,
        ]
      : [])
  );
  const rawParagraph = getFormField(
    formData,
    "paragraph",
    ...(idx
      ? [
          `paragraph${idx}`,
          `paragraph_${idx}`,
          `paragraph[${idx}]`,
          `${key}[paragraph]`,
          `${key}.paragraph`,
        ]
      : [])
  );

  const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;
  const heading = rawHeading !== null && rawHeading !== "" ? String(rawHeading) : undefined;
  const paragraph = rawParagraph !== null && rawParagraph !== "" ? String(rawParagraph) : undefined;

  return { heading, paragraph, image };
}