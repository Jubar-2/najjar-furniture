"use client";

import Hero from "@/components/app/home/Hero";
import { useGetBanner } from "@/customHooks/getBanner";
import { useGetContact } from "@/customHooks/useContact";

export default function HomeHeroClint() {
    const { data: bannerData, isLoading: isBannerLoading, error: bannerError } = useGetBanner();
    const { data: contactData } = useGetContact();

    // On fetch error, fall back to Hero's built-in defaults with available contact data
    if (bannerError) {
        console.error("Failed to load hero/banner content:", bannerError);
        return (
            <Hero
                whatsAppNumber={contactData?.whatsapps?.[0]?.value}
                socials={contactData?.socials}
            />
        );
    }

    const effectiveWhatsApp =
        bannerData?.whatsAppNumber?.trim() ||
        contactData?.whatsapps?.[0]?.value ||
        undefined;

    return (
        <Hero
            isLoading={isBannerLoading}
            imageSrc={bannerData?.banner}
            headline={bannerData?.heading ? [bannerData.heading] : undefined}
            description={bannerData?.paragraph}
            whatsAppNumber={effectiveWhatsApp}
            ctaLabel={bannerData?.ctaLabel || "Chat on WhatsApp"}
            showWhatsApp={bannerData?.showWhatsApp !== false}
            showSocials={bannerData?.showSocials !== false}
            socials={contactData?.socials}
        />
    );
}