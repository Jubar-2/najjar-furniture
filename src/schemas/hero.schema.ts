import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const HeroSchema = z.object({
    heading: z.string("Heading is must be string."),
    paragraph: z.string("Heading is must be string."),
    banner: z.any()
        .refine((file) => file instanceof File, "Please upload a screenshot of your work.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Screenshot must be smaller than 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, and .webp formats are accepted."
        ),
    whatsAppNumber: z.string().optional(),
    ctaLabel: z.string().optional(),
    showWhatsApp: z.boolean().optional(),
    showSocials: z.boolean().optional(),
});

export type Hero = z.infer<typeof HeroSchema>;

export const HeroUpdatedSchema = z.object({
    heading: z.string("Heading is must be string.").optional(),
    paragraph: z.string("Heading is must be string.").optional(),
    banner: z.any()
        .refine((file) => file instanceof File, "Please upload a screenshot of your work.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Screenshot must be smaller than 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, and .webp formats are accepted."
        ).optional(),
    whatsAppNumber: z.string().optional(),
    ctaLabel: z.string().optional(),
    showWhatsApp: z.boolean().optional(),
    showSocials: z.boolean().optional(),
});

export type HeroUpdated = z.infer<typeof HeroUpdatedSchema>;