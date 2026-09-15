import { z } from "zod";

// Text-only page sections (e.g. privacy-policy) store rich HTML in the
// PageSection.content.body field. No file uploads, so these are validated
// from a JSON request body instead of FormData.

export const PageContentCreateSchema = z.object({
  body: z.string("Body must be a string.").min(1, "Content is required."),
});

export const PageContentUpdateSchema = z.object({
  body: z.string("Body must be a string.").min(1, "Content is required.").optional(),
});

export type PageContentCreate = z.infer<typeof PageContentCreateSchema>;
export type PageContentUpdate = z.infer<typeof PageContentUpdateSchema>;

/** Reads `body` off a JSON payload, normalizing empty/missing values to undefined. */
export function readPageContentFromJson(json: unknown) {
  if (typeof json !== "object" || json === null) return {};

  const { body } = json as { body?: unknown };

  return {
    body: typeof body === "string" && body.length > 0 ? body : undefined,
  };
}