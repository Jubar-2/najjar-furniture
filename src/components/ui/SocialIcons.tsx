import React from "react";

export interface SocialIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function FacebookIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.36.06-.55.27-.19.21-.73.71-.73 1.74s.75 2.02.85 2.16c.11.14 1.45 2.28 3.56 3.16.51.21.9.34 1.22.44.52.17.99.14 1.36.09.42-.06 1.28-.52 1.46-1.03.18-.51.18-.95.13-1.04-.06-.09-.2-.14-.42-.25-.22-.11-1.28-.63-1.48-.7-.2-.07-.35-.11-.5.11-.14.22-.57.7-.7.85-.13.15-.25.17-.47.06-.22-.11-.92-.34-1.75-1.08-.65-.58-1.09-1.29-1.22-1.51-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.15-.22.22-.36.07-.15.04-.28-.02-.39-.06-.11-.53-1.28-.73-1.75-.19-.46-.39-.4-.53-.41z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function XIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TikTokIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function PinterestIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.399.156-1.49-.693-2.423-2.875-2.423-4.627 0-3.769 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.374l-.746 2.846c-.27 1.039-1.002 2.342-1.493 3.136 1.137.351 2.345.541 3.597.541 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z" />
    </svg>
  );
}

export function TelegramIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function ThreadsIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.003 0C5.372 0 0 5.372 0 12.003c0 6.63 5.372 12.003 12.003 12.003 6.63 0 12.003-5.372 12.003-12.003C24.006 5.372 18.633 0 12.003 0zm4.72 14.195c-.173 1.956-1.326 3.42-3.136 3.87-1.383.344-2.822.115-3.926-.622-.962-.643-1.579-1.657-1.737-2.855-.175-1.328.212-2.616 1.09-3.626 1.042-1.198 2.616-1.87 4.316-1.84.444.008.885.064 1.312.166.196.047.388.106.577.177.012-.862-.224-1.58-.702-2.13-.535-.615-1.294-.94-2.196-.94-.889 0-1.633.31-2.152.898-.382.433-.61 1.002-.68 1.693l-1.928-.27c.123-1.19.57-2.183 1.328-2.952.92-.932 2.185-1.42 3.655-1.42 1.542 0 2.85.556 3.782 1.608.85.958 1.282 2.247 1.285 3.83v4.453c0 .35.034.693.102 1.02.164.792.65 1.258 1.488 1.423l-.367 1.83c-1.343-.227-2.296-.985-2.637-2.257-.15-.558-.21-1.157-.21-1.78zm-1.884-.712c-.08-.073-.185-.128-.31-.164-.326-.094-.71-.144-1.144-.15-1.173-.016-2.193.398-2.798 1.136-.505.617-.674 1.385-.476 2.16.177.697.66 1.237 1.36 1.52.753.305 1.674.28 2.457-.067.973-.432 1.543-1.29 1.642-2.478.02-.244.02-.486 0-.728l-.731-1.229z" />
    </svg>
  );
}

export function GlobeIcon({ size = 20, className = "", ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export interface PlatformConfig {
  key: string;
  label: string;
  defaultPrefix: string;
  placeholder: string;
  Icon: React.ComponentType<SocialIconProps>;
  color: string;
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  facebook: {
    key: "facebook",
    label: "Facebook",
    defaultPrefix: "https://facebook.com/",
    placeholder: "https://facebook.com/najjarfurniture",
    Icon: FacebookIcon,
    color: "#1877F2",
  },
  instagram: {
    key: "instagram",
    label: "Instagram",
    defaultPrefix: "https://instagram.com/",
    placeholder: "https://instagram.com/najjarfurniture",
    Icon: InstagramIcon,
    color: "#E4405F",
  },
  whatsapp: {
    key: "whatsapp",
    label: "WhatsApp",
    defaultPrefix: "https://wa.me/",
    placeholder: "+880 1712-345678 or https://wa.me/8801...",
    Icon: WhatsAppIcon,
    color: "#25D366",
  },
  youtube: {
    key: "youtube",
    label: "YouTube",
    defaultPrefix: "https://youtube.com/@",
    placeholder: "https://youtube.com/@najjarfurniture",
    Icon: YouTubeIcon,
    color: "#FF0000",
  },
  linkedin: {
    key: "linkedin",
    label: "LinkedIn",
    defaultPrefix: "https://linkedin.com/company/",
    placeholder: "https://linkedin.com/company/najjar-furniture",
    Icon: LinkedInIcon,
    color: "#0A66C2",
  },
  x: {
    key: "x",
    label: "X (Twitter)",
    defaultPrefix: "https://x.com/",
    placeholder: "https://x.com/najjarfurniture",
    Icon: XIcon,
    color: "#000000",
  },
  tiktok: {
    key: "tiktok",
    label: "TikTok",
    defaultPrefix: "https://tiktok.com/@",
    placeholder: "https://tiktok.com/@najjarfurniture",
    Icon: TikTokIcon,
    color: "#000000",
  },
  pinterest: {
    key: "pinterest",
    label: "Pinterest",
    defaultPrefix: "https://pinterest.com/",
    placeholder: "https://pinterest.com/najjarfurniture",
    Icon: PinterestIcon,
    color: "#BD081C",
  },
  telegram: {
    key: "telegram",
    label: "Telegram",
    defaultPrefix: "https://t.me/",
    placeholder: "https://t.me/najjarfurniture",
    Icon: TelegramIcon,
    color: "#24A1DE",
  },
  threads: {
    key: "threads",
    label: "Threads",
    defaultPrefix: "https://threads.net/@",
    placeholder: "https://threads.net/@najjarfurniture",
    Icon: ThreadsIcon,
    color: "#000000",
  },
  website: {
    key: "website",
    label: "Website / Other",
    defaultPrefix: "https://",
    placeholder: "https://najjarfurniture.com",
    Icon: GlobeIcon,
    color: "#6b7280",
  },
};

export const SOCIAL_PLATFORM_LIST = Object.values(PLATFORM_CONFIGS);

export function normalizePlatformKey(name?: string): string {
  if (!name) return "website";
  const clean = name.trim().toLowerCase();
  if (clean === "fb" || clean === "facebook") return "facebook";
  if (clean === "ig" || clean === "insta" || clean === "instagram") return "instagram";
  if (clean === "wa" || clean === "whatsapp") return "whatsapp";
  if (clean === "yt" || clean === "youtube") return "youtube";
  if (clean === "li" || clean === "linkedin") return "linkedin";
  if (clean === "twitter" || clean === "x") return "x";
  if (clean === "tiktok" || clean === "tik-tok") return "tiktok";
  if (clean === "pin" || clean === "pinterest") return "pinterest";
  if (clean === "tg" || clean === "telegram") return "telegram";
  if (clean === "threads") return "threads";
  if (clean === "web" || clean === "globe" || clean === "site" || clean === "website") return "website";
  return PLATFORM_CONFIGS[clean] ? clean : "website";
}

export function getSocialIconComponent(platformName?: string): React.ComponentType<SocialIconProps> {
  const key = normalizePlatformKey(platformName);
  return PLATFORM_CONFIGS[key]?.Icon || GlobeIcon;
}

export function SocialIcon({
  platform,
  size = 20,
  className = "",
  ...props
}: {
  platform?: string;
} & SocialIconProps) {
  const IconComponent = getSocialIconComponent(platform);
  return <IconComponent size={size} className={className} {...props} />;
}
