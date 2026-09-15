import { z } from "zod";

export const LayerSchema = z.object({
    heading: z.string("Heading must be a string.").min(1, "Heading is required."),
    paragraph: z.string("Paragraph must be a string.").min(1, "Paragraph is required."),
    image: z.instanceof(File, { message: "Image must be a file." }),
});

export type LayerType = z.infer<typeof LayerSchema>;