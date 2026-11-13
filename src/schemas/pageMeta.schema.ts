import { z } from "zod";

/**
 * Sanitizes and extracts the verification code from either a raw token
 * or a full HTML meta tag pasted from Google Search Console.
 * Example inputs handled:
 * - `<meta name="google-site-verification" content="dB9e9z4_abc123" />` -> `dB9e9z4_abc123`
 * - `<meta content="dB9e9z4_abc123" name="google-site-verification">` -> `dB9e9z4_abc123`
 * - `content="dB9e9z4_abc123"` -> `dB9e9z4_abc123`
 * - `"dB9e9z4_abc123"` -> `dB9e9z4_abc123`
 * - `dB9e9z4_abc123` -> `dB9e9z4_abc123`
 */
export function sanitizeGoogleVerificationCode(input?: string | null): string {
  if (!input) return "";
  let val = input.trim();

  // If full HTML meta tag is pasted
  const metaMatch = val.match(/<meta[^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaMatch && metaMatch[1]) {
    val = metaMatch[1].trim();
  } else {
    // If user pasted content="xyz"
    const contentMatch = val.match(/content=["']([^"']+)["']/i);
    if (contentMatch && contentMatch[1]) {
      val = contentMatch[1].trim();
    }
  }

  // Strip leading/trailing quotes and brackets
  val = val.replace(/^["']|["']$/g, "").trim();

  // Strip any remaining HTML tags or angular brackets
  val = val.replace(/<[^>]*>?/gm, "").trim();

  return val;
}

export const GoogleVerificationSchema = z.object({
  google_site_verification: z
    .string()
    .max(255, "Verification code must be 255 characters or fewer.")
    .refine(
      (val) => {
        const sanitized = sanitizeGoogleVerificationCode(val);
        // Allow empty string (clearing the verification tag) or valid token characters
        return sanitized === "" || /^[A-Za-z0-9_=-]+$/.test(sanitized);
      },
      {
        message:
          "Verification code contains invalid characters. Please enter a valid Google verification token or HTML tag.",
      },
    )
    .optional()
    .nullable(),
});

export type GoogleVerificationInput = z.infer<typeof GoogleVerificationSchema>;

export const PageMetaSchema = z.object({
  title: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_og_image: z.string().optional(),
  meta_author: z.string().optional(),
  google_site_verification: z
    .string()
    .max(255)
    .refine(
      (val) => {
        const sanitized = sanitizeGoogleVerificationCode(val);
        return sanitized === "" || /^[A-Za-z0-9_=-]+$/.test(sanitized);
      },
      {
        message: "Verification code contains invalid characters.",
      },
    )
    .optional()
    .nullable(),
});

export type PageMeta = z.infer<typeof PageMetaSchema>;

/** Reads the meta field(s) off an incoming JSON body, normalizing empty strings to undefined. */
export function readPageMetaFromJson(json: Record<string, unknown>) {
  const pick = (key: string) => {
    const value = json[key];
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };

  const verificationRaw = json["google_site_verification"];
  const googleVerification =
    typeof verificationRaw === "string"
      ? sanitizeGoogleVerificationCode(verificationRaw)
      : undefined;

  return {
    title: pick("title"),
    meta_title: pick("meta_title"),
    meta_description: pick("meta_description"),
    meta_keywords: pick("meta_keywords"),
    meta_og_image: pick("meta_og_image"),
    meta_author: pick("meta_author"),
    google_site_verification: googleVerification,
  };
}
