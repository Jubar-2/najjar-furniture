import {
  CircleHelp,
  Sofa,
  Ruler,
  Boxes,
  Truck,
  ShieldCheck,
  MapPin,
  MessageSquareText,
  Users,
  Heart,
  Star,
  ThumbsUp,
  Camera,
  Video,
  Briefcase,
  AtSign,
  Music2,
  Share2,
  MessageCircle,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ContactSection } from "@/schemas/contact.schema";

export const TOPIC_ICONS: Record<string, LucideIcon> = {
  comment: MessageSquareText,
  sofa: Sofa,
  ruler: Ruler,
  boxes: Boxes,
  truck: Truck,
  shield: ShieldCheck,
  "map-pin": MapPin,
  users: Users,
  heart: Heart,
  star: Star,
};

export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: ThumbsUp,
  instagram: Camera,
  youtube: Video,
  linkedin: Briefcase,
  whatsapp: MessageCircle,
  twitter: AtSign,
  x: AtSign,
  tiktok: Music2,
  pinterest: Share2,
};

export const TOPIC_ICON_OPTIONS: { key: string; label: string }[] = Object.keys(
  TOPIC_ICONS
).map((key) => ({ key, label: key }));

export function resolveTopicIcon(key?: string): LucideIcon {
  const icon = key ? TOPIC_ICONS[key.toLowerCase()] : undefined;
  return icon ?? CircleHelp;
}

export function resolveSocialIcon(name?: string): LucideIcon {
  const icon = name ? SOCIAL_ICONS[name.toLowerCase()] : undefined;
  return icon ?? Globe;
}

export const DEFAULT_CONTACT: ContactSection = {
  emails: [
    { label: "Support", value: "support@najjarfurniture.com" },
    { label: "General", value: "info@najjarfurniture.com" },
  ],
  phones: [
    { label: "Sales", value: "+880 1XXX-XXXXXX" },
    { label: "Showroom", value: "+880 1XXX-XXXXXX" },
  ],
  whatsapps: [
    { label: "Sales", value: "+880 1XXX-XXXXXX" },
    { label: "Support", value: "+880 1XXX-XXXXXX" },
  ],
  socials: [
    { name: "facebook", url: "https://facebook.com" },
    { name: "instagram", url: "https://instagram.com" },
    { name: "youtube", url: "https://youtube.com" },
    { name: "linkedin", url: "https://linkedin.com" },
  ],
  topics: [
    { label: "General Inquiry", icon: "comment" },
    { label: "Custom Order", icon: "ruler" },
    { label: "Bulk / Wholesale", icon: "boxes" },
    { label: "Delivery & Shipping", icon: "truck" },
    { label: "Warranty & Repair", icon: "shield" },
    { label: "Showroom Visit", icon: "map-pin" },
  ],
  address: "Dhaka, Bangladesh",
  showroomHours: "Sat–Thu, 10am–8pm",
  responseTimes: [
    { channel: "Phone", time: "Instant" },
    { channel: "WhatsApp", time: "< 30 mins" },
    { channel: "Email", time: "1–2 days" },
    { channel: "Contact Form", time: "1–2 days" },
  ],
  cta: {
    title: "Still have questions?",
    subtitle: "We're here to help",
    description:
      "Our team is available every day. Reach out by phone, email, or visit our showroom in person.",
    ctaLabel: "Chat With Us",
    ctaHref: "https://wa.me/8801XXXXXXXXX",
  },
};

/** Turns a phone number like "+880 17XX-XXXXXX" into a wa.me href. */
export function waLink(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "https://wa.me/";
}