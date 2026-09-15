import { z } from "zod";

export const ContactItemSchema = z.object({
  label: z.string().default(""),
  value: z.string().default(""),
});

export const SocialLinkSchema = z.object({
  name: z.string().default(""),
  url: z.string().default(""),
});

export const TopicSchema = z.object({
  label: z.string().min(1, "Topic label is required."),
  icon: z.string().default("comment"),
});

export const ResponseTimeSchema = z.object({
  channel: z.string().default(""),
  time: z.string().default(""),
});

export const ContactSchema = z.object({
  emails: z.array(ContactItemSchema),
  phones: z.array(ContactItemSchema),
  whatsapps: z.array(ContactItemSchema),
  socials: z.array(SocialLinkSchema),
  topics: z.array(TopicSchema),
  address: z.string().default(""),
  showroomHours: z.string().default(""),
  responseTimes: z.array(ResponseTimeSchema),
  cta: z.object({
    title: z.string().default(""),
    subtitle: z.string().default(""),
    description: z.string().default(""),
    ctaLabel: z.string().default(""),
    ctaHref: z.string().default(""),
  }),
});

export const ContactMessageCreateSchema = z.object({
  name: z.string("Name must be a string.").min(1, "Name is required."),
  email: z.email("A valid email is required."),
  topic: z.string("Topic must be a string.").min(1, "Topic is required."),
  message: z.string("Message must be a string.").min(1, "Message is required."),
});

export const ContactMessageStatusValues = ["new", "read", "resolved"] as const;
export type ContactMessageStatus = (typeof ContactMessageStatusValues)[number];

export const ContactMessageStatusSchema = z.object({
  status: z.enum(ContactMessageStatusValues).default("new"),
});

export type ContactSection = z.infer<typeof ContactSchema>;
export type ContactItem = z.infer<typeof ContactItemSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type ResponseTime = z.infer<typeof ResponseTimeSchema>;
export type ContactMessageCreate = z.infer<typeof ContactMessageCreateSchema>;