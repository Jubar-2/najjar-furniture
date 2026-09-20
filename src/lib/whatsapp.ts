/**
 * WhatsApp click-to-chat utility and phone number normalizer.
 *
 * Implements Meta / WhatsApp official click-to-chat format:
 * https://wa.me/<country-code-and-number>?text=<encoded-message>
 *
 * Automatically handles:
 * - Local Bangladesh formats: 01XXXXXXXXX -> 8801XXXXXXXXX
 * - Formatted numbers: +880 1712-345678 -> 8801712345678
 * - International numbers: +1 (555) 234-5678 -> 15552345678 (preserves international country code without adding 880)
 * - Raw wa.me / api.whatsapp.com URLs: extracts phone and pre-existing message
 * - Safe fallback for placeholders (+880 1XXX-XXXXXX or 8801XXXXXXXXX)
 */

export const DEFAULT_WHATSAPP_NUMBER = "8801XXXXXXXXX";

/**
 * Normalizes any phone number string or WhatsApp URL into pure digits with country code.
 */
export function normalizeWhatsAppNumber(input?: string | null): string {
    if (!input || typeof input !== "string") {
        return DEFAULT_WHATSAPP_NUMBER;
    }

    const trimmed = input.trim();
    if (!trimmed) {
        return DEFAULT_WHATSAPP_NUMBER;
    }

    // If input is an existing WhatsApp URL, extract the phone part from path/query
    if (trimmed.includes("wa.me/") || trimmed.includes("whatsapp.com/")) {
        try {
            // Support URLs with or without protocol
            const urlString = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
            const parsed = new URL(urlString);

            // Handle https://wa.me/<number>
            if (parsed.hostname.includes("wa.me")) {
                const pathPart = parsed.pathname.replace(/^\/+/, "").split("/")[0] || "";
                if (pathPart) {
                    return normalizeWhatsAppNumber(pathPart);
                }
            }

            // Handle https://api.whatsapp.com/send?phone=<number>
            const phoneParam = parsed.searchParams.get("phone");
            if (phoneParam) {
                return normalizeWhatsAppNumber(phoneParam);
            }
        } catch {
            // Fall through to regular regex processing if URL parsing fails
        }
    }

    // Check if the input starts with an explicit '+' international sign
    const hasLeadingPlus = trimmed.startsWith("+");

    // Check if placeholder (contains X or x)
    if (/[xX]/.test(trimmed)) {
        // e.g. "+880 1XXX-XXXXXX" or "8801XXXXXXXXX"
        const clean = trimmed.replace(/[^0-9xX]/g, "");
        if (clean.startsWith("880") || clean.startsWith("01")) {
            return DEFAULT_WHATSAPP_NUMBER;
        }
        return clean.replace(/\D/g, "") || DEFAULT_WHATSAPP_NUMBER;
    }

    // Strip everything except digits
    let digits = trimmed.replace(/\D/g, "");

    if (!digits) {
        return DEFAULT_WHATSAPP_NUMBER;
    }

    // Strip leading international prefix "00" (e.g. 0088017... -> 88017...)
    if (digits.startsWith("00")) {
        digits = digits.slice(2);
    }

    // Explicit international number with '+' prefix (e.g., +1 555 123 4567, +44 7911 123456)
    if (hasLeadingPlus) {
        return digits;
    }

    // Already has Bangladesh country code 880
    if (digits.startsWith("880")) {
        return digits;
    }

    // Bangladesh standard local mobile number: 11 digits starting with "01" (e.g. 017XXXXXXXX)
    if (digits.startsWith("01") && digits.length === 11) {
        return `880${digits.slice(1)}`; // Replace leading 0 with 880 -> 8801XXXXXXXX
    }

    // Bangladesh local number without leading zero: 10 digits starting with "1" (e.g. 17XXXXXXXX)
    if (digits.startsWith("1") && digits.length === 10) {
        return `880${digits}`;
    }

    // If it's a 11-digit number starting with 0 (other than 01), keep or strip leading 0
    if (digits.startsWith("0") && digits.length > 9) {
        return `880${digits.slice(1)}`;
    }

    return digits;
}

/**
 * Generates an official WhatsApp click-to-chat URL:
 * https://wa.me/<normalized_phone>[?text=<encoded_message>]
 *
 * @param phoneOrUrl - Phone number (e.g. "+880 1712-345678", "01712345678") or existing WhatsApp link
 * @param message - Optional message to pre-fill in the chat
 */
export function getWhatsAppUrl(phoneOrUrl?: string | null, message?: string | null): string {
    let existingMessage = "";

    // If input is an existing URL, extract any pre-configured text parameter
    if (phoneOrUrl && typeof phoneOrUrl === "string" && (phoneOrUrl.includes("wa.me/") || phoneOrUrl.includes("whatsapp.com/"))) {
        try {
            const urlString = phoneOrUrl.startsWith("http") ? phoneOrUrl : `https://${phoneOrUrl}`;
            const parsed = new URL(urlString);
            existingMessage = parsed.searchParams.get("text") || "";
        } catch {
            // Ignore parse error
        }
    }

    const cleanPhone = normalizeWhatsAppNumber(phoneOrUrl);
    const finalMessage = message !== undefined && message !== null ? message : existingMessage;

    if (finalMessage && finalMessage.trim()) {
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage.trim())}`;
    }

    return `https://wa.me/${cleanPhone}`;
}
