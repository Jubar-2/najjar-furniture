import { z } from "zod";

const HomeLayerItemSchema = z.object({
  heading: z.string("Heading must be a string.").min(1, "Heading is required."),
  paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
  image: z.instanceof(File, { message: "Image must be a file." }),
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

// Update: each item is optional (only send the ones you're changing), but
// if you DO send an item, it must be complete — no partial single-field
// updates within one item, since heading/paragraph/image are stored together.
export const HomeLayerThreeUpdateSchema = z.object({
  item1: HomeLayerItemSchema.optional(),
  item2: HomeLayerItemSchema.optional(),
  item3: HomeLayerItemSchema.optional(),
  item4: HomeLayerItemSchema.optional(),
  item5: HomeLayerItemSchema.optional(),
  item6: HomeLayerItemSchema.optional(),
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

/**
 * Reads image{N}/heading{N}/paragraph{N} (N = 1..6) off incoming FormData
 * and reshapes them into { item1: {...}, item2: {...}, ... } so they match
 * the nested schemas above — the flat field names formData.get() gives you
 * don't line up with the nested shape Zod needs to validate against.
 *
 * `requireAll`:
 *   - true  (POST/create): every item key is always included, even if empty
 *            — missing required fields, so Zod's own validation reports it.
 *   - false (PATCH/update): an item key is only included if at least one of
 *            its 3 fields was actually sent, so untouched items are left
 *            out entirely rather than failing validation for "missing" data
 *            that was never meant to be sent.
 */
export function readHomeLayerThreeFromFormData(formData: FormData, requireAll: boolean) {
  const items: Record<string, unknown> = {};

  for (const key of HOME_LAYER_THREE_KEYS) {
    const index = key.replace("item", "");

    const rawImage = formData.get(`image${index}`);
    const rawHeading = formData.get(`heading${index}`);
    const rawParagraph = formData.get(`paragraph${index}`);

    // "" for a missing text field, a zero-byte File for a missing file
    // input — normalize both to undefined so .optional() actually works.
    const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;
    const heading = rawHeading ? String(rawHeading) : undefined;
    const paragraph = rawParagraph ? String(rawParagraph) : undefined;

    const hasAnyField = image !== undefined || heading !== undefined || paragraph !== undefined;

    if (requireAll || hasAnyField) {
      items[key] = { image, heading, paragraph };
    }
  }

  return items;
}