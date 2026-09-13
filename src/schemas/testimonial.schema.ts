import { z } from "zod";

// Note: your Mongoose schema only marks `message` as required, but a
// testimonial with no name/location seems like an oversight rather than
// intentional — I'm requiring name + message here at the API layer (the
// stricter validation gate), while location stays optional. Loosen this
// back to match the Mongoose schema exactly if that was actually intentional.
export const TestimonialCreateSchema = z.object({
  name: z.string("Name must be a string.").min(1, "Name is required."),
  location: z.string("Location must be a string.").optional(),
  message: z.string("Message must be a string.").min(1, "Message is required."),
  avatar: z.instanceof(File, { message: "Avatar must be a file." }).optional(),
});

export const TestimonialUpdateSchema = z.object({
  name: z.string("Name must be a string.").min(1, "Name is required.").optional(),
  location: z.string("Location must be a string.").optional(),
  message: z.string("Message must be a string.").min(1, "Message is required.").optional(),
  avatar: z.instanceof(File, { message: "Avatar must be a file." }).optional(),
});

export type TestimonialCreate = z.infer<typeof TestimonialCreateSchema>;
export type TestimonialUpdate = z.infer<typeof TestimonialUpdateSchema>;

/** Reads the 4 fields off incoming FormData, normalizing empty/unset values to undefined. */
export function readTestimonialFromFormData(formData: FormData) {
  const rawName = formData.get("name");
  const rawLocation = formData.get("location");
  const rawMessage = formData.get("message");
  const rawAvatar = formData.get("avatar");

  return {
    name: rawName ? String(rawName) : undefined,
    location: rawLocation ? String(rawLocation) : undefined,
    message: rawMessage ? String(rawMessage) : undefined,
    avatar: rawAvatar instanceof File && rawAvatar.size > 0 ? rawAvatar : undefined,
  };
}