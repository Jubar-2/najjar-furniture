import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
    phoneNumber?: string; // e.g. "+880 1712-345678", "01712-345678", or "8801XXXXXXXXX"
    message?: string;
    label?: string;
    className?: string;
}

export default function WhatsAppButton({
    phoneNumber = "8801703165333",
    message,
    label = "Chat on WhatsApp",
    className = "",
}: WhatsAppButtonProps) {
    const href = getWhatsAppUrl(phoneNumber, message);

    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-3 sm:gap-4 bg-[#EFD5AB] px-5 sm:px-6 py-2.5 sm:py-3.5 transition-colors hover:bg-[#e8cf95] shadow-sm ${className}`}
        >
            <WhatsAppIcon className="size-6 sm:size-7 text-[#4a2f1c] shrink-0" />

            <span className="h-9 inline-block w-px bg-[linear-gradient(180deg,rgba(121,87,69,0.12)_0%,#381604_46.63%,rgba(118,85,67,0.26)_100%)]" />

            <span className="font-serif text-base sm:text-lg text-[#4a2f1c]">{label}</span>

            <ArrowRight className="size-4 sm:size-5 text-[#4a2f1c] transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
    );
}

// lucide-react doesn't ship brand icons — this is a plain inline SVG of
// the WhatsApp glyph, colored via `currentColor` so it follows the
// `text-[#4a2f1c]` class passed in above.
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M22.2117 3.77546C19.7679 1.34194 16.5177 0.00122099 13.0546 0C5.91868 0 0.111078 5.77487 0.108622 12.8732C0.107394 15.1424 0.703878 17.3573 1.83676 19.3092L0 25.981L6.86284 24.1908C8.75355 25.2168 10.8827 25.757 13.049 25.7576H13.0546C20.1893 25.7576 25.9975 19.9821 26 12.8837C26.0012 9.44353 24.6561 6.20948 22.2117 3.77603V3.77546ZM13.0546 23.5834H13.0503C11.1198 23.5829 9.22596 23.0667 7.57358 22.092L7.1807 21.86L3.10801 22.9223L4.19496 18.9734L3.93914 18.5685C2.86217 16.8647 2.29298 14.8955 2.29421 12.8739C2.29674 6.97432 7.1235 2.17416 13.059 2.17416C15.9329 2.17538 18.6344 3.28958 20.666 5.31248C22.6977 7.3348 23.8156 10.0238 23.8144 12.8825C23.8119 18.7827 18.9851 23.5829 13.0546 23.5829V23.5834ZM18.9565 15.5696C18.6331 15.4085 17.0429 14.6307 16.7461 14.5233C16.4494 14.4159 16.234 14.3622 16.0186 14.6844C15.8032 15.0067 15.1831 15.7314 14.9944 15.9455C14.8057 16.1604 14.617 16.1869 14.2936 16.0258C13.9702 15.8647 12.928 15.5252 11.6921 14.4294C10.7306 13.5763 10.0813 12.5232 9.89264 12.201C9.70392 11.8788 9.87278 11.7047 10.0341 11.5448C10.1794 11.4004 10.3575 11.1689 10.5195 10.9812C10.6815 10.7935 10.735 10.659 10.8429 10.4447C10.951 10.2299 10.897 10.0423 10.8163 9.88115C10.7355 9.72005 10.0888 8.13664 9.81876 7.49281C9.55616 6.86565 9.28929 6.95083 9.09126 6.94035C8.90254 6.93101 8.68718 6.92922 8.47116 6.92922C8.25515 6.92922 7.90501 7.00951 7.60832 7.33171C7.31163 7.65391 6.47609 8.43233 6.47609 10.0151C6.47609 11.5979 7.63504 13.1282 7.79704 13.343C7.95903 13.5579 10.0782 16.8067 13.3228 18.2006C14.0944 18.532 14.6971 18.7302 15.167 18.8784C15.9417 19.1234 16.6468 19.0889 17.2042 19.0061C17.8256 18.9136 19.1179 18.2277 19.3873 17.4765C19.6567 16.7252 19.6567 16.0807 19.5761 15.9468C19.4954 15.8128 19.2794 15.7319 18.956 15.5708L18.9565 15.5696Z" fill="#381604" />
        </svg>
    );
}
