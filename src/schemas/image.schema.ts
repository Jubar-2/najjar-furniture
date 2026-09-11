import { z } from "zod";

// Shared across every section schema that stores an image — Hero banner,
// About Us portrait, Portfolio grid tiles, testimonial avatars, etc.
export const ImageSchema = z.object({
  src: z.url("Image src must be a valid URL."),
  alt: z.string("Alt text must be a string.").min(1, "Alt text is required."),
  width: z.number("Width must be a number.").positive().optional(),
  height: z.number("Height must be a number.").positive().optional(),
});


export type Image = z.infer<typeof ImageSchema>;