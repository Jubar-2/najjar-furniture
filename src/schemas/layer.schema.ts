import { z } from "zod";

export const LayerCreateSchema = z.object({
    heading: z.string("Heading must be a string.").min(1, "Heading is required."),
    paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
    image: z.instanceof(File, { message: "Image must be a file." }),
});

export const LayerUpdateSchema = z.object({
    heading: z.string("Heading must be a string.").min(1, "Heading is required.").optional(),
    paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required.").optional(),
    image: z.instanceof(File, { message: "Image must be a file." }).optional(),
});

export const LayerSchema = LayerCreateSchema;
export type LayerType = z.infer<typeof LayerSchema>;
export type LayerUpdateType = z.infer<typeof LayerUpdateSchema>;