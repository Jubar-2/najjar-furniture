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

export {
  SocialIcon,
  PLATFORM_CONFIGS,
  SOCIAL_PLATFORM_LIST,
  getSocialIconComponent,
  normalizePlatformKey,
} from "@/components/ui/SocialIcons";

export function resolveSocialIcon(name?: string): LucideIcon {
  const icon = name ? SOCIAL_ICONS[name.toLowerCase()] : undefined;
  return icon ?? Globe;
}

export const DEFAULT_CONTACT: ContactSection = {
  emails: [],
  phones: [],
  whatsapps: [],
  socials: [],
  topics: [],
  address: "",
  showroomHours: "",
  responseTimes: [],
  cta: {
    title: "",
    subtitle: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
  },
};

import { getWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";
export { getWhatsAppUrl, normalizeWhatsAppNumber };

/** Turns any phone number, WhatsApp link, or formatted string into an official wa.me click-to-chat URL. */
export function waLink(value?: string, message?: string): string {
  if (!value || !value.trim()) return "#";
  return getWhatsAppUrl(value, message);
}