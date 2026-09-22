import { memo } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Header from "../Header";
import Container from "@/components/utils/Container";
import { HeroTextSkeleton } from "./HeroTextSkeleton";
import WhatsAppButton from "@/components/app/WhatsAppButton";
import { DEFAULT_CONTACT } from "@/lib/contact";
import { optimizeCloudinaryUrl } from "@/lib/images";
import { SocialIcon } from "@/components/ui/SocialIcons";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { SocialLink } from "@/schemas/contact.schema";

interface HeroProps {
    imageSrc?: string | StaticImageData;
    imageAlt?: string;
    eyebrow?: string;
    headline?: string[];
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    whatsAppNumber?: string;
    showWhatsApp?: boolean;
    showSocials?: boolean;
    socials?: SocialLink[];
    isLoading?: boolean;
}

function Hero({
    imageSrc,
    imageAlt = "Handcrafted wooden armchair in a warm living space",
    headline = ["Crafted by Nature.", "Designed for Life."],
    description = "Every piece is thoughtfully designed and expertly handcrafted to combine natural beauty, lasting durability, and refined elegance—creating furniture that belongs in your space for generations",
    ctaLabel = "Chat on WhatsApp",
    whatsAppNumber = DEFAULT_CONTACT.whatsapps[0]?.value || "8801XXXXXXXXX",
    showWhatsApp = true,
    showSocials = true,
    socials = DEFAULT_CONTACT.socials,
    isLoading = false,
}: HeroProps) {
    const validSocials = socials?.filter((s) => s.name && s.url) || [];

    return (
        <section className="relative min-h-145 sm:min-h-160 md:min-h-180 w-full bg-[#0f0b08] flex flex-col justify-center">
            {/* Background image & gradient overlay — isolated in an overflow-hidden wrapper so Header dropdown is never clipped */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {isLoading || !imageSrc ? (
                    <div className="absolute inset-0 animate-pulse bg-[#2c2620]" />
                ) : (
                    <Image
                        src={typeof imageSrc === "string" ? optimizeCloudinaryUrl(imageSrc, { width: 1920 }) : imageSrc}
                        alt={imageAlt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                )}
                {/* Gradient overlay — darkest at left where text sits, fading toward the image */}
                <div className="absolute inset-0 bg-linear-to-r from-[#0f0b08]/95 via-[#0f0b08]/65 to-[#0f0b08]/20" />
            </div>

            <Header />

            {/* Content */}
            <Container>
                <div className="relative z-10 flex w-full h-full items-center pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24">
                    <div className="max-w-xl">
                        {isLoading ? (
                            <HeroTextSkeleton />
                        ) : (
                            <>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-tight sm:leading-[1.15] text-[#f2ead9]">
                                    {headline.map((line) => (
                                        <span
                                            key={line}
                                            className="block font-bold"
                                            style={{ fontFamily: "var(--font-cormorant-upright)" }}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </h1>

                                <p className="mt-4 sm:mt-5 max-w-md text-sm sm:text-base leading-relaxed text-white/90 font-normal">
                                    {description}
                                </p>

                                {(showWhatsApp || (showSocials && validSocials.length > 0)) && (
                                    <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                                        {showWhatsApp && (
                                            <WhatsAppButton
                                                phoneNumber={whatsAppNumber}
                                                label={ctaLabel}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default memo(Hero);