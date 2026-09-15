import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "../Header";
import Container from "@/components/utils/Container";
import { HeroTextSkeleton } from "./HeroTextSkeleton";

interface HeroProps {
    imageSrc?: string | StaticImageData;
    imageAlt?: string;
    eyebrow?: string;
    headline?: string[];
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    isLoading?: boolean;
}

export default function Hero({
    imageSrc,
    imageAlt = "Handcrafted wooden armchair in a warm living space",
    headline = ["Crafted by Nature.", "Designed for Life."],
    description = "Every piece is thoughtfully designed and expertly handcrafted to combine natural beauty, lasting durability, and refined elegance—creating furniture that belongs in your space for generations",
    ctaLabel = "Explore Collection",
    ctaHref = "/collection",
    isLoading = false,
}: HeroProps) {
    return (
        <section className="relative h-150 w-full overflow-hidden bg-[#0f0b08] md:h-180">
            {/* Background image — skeleton while loading, real image once we
                actually have a src. Never renders <Image> with an empty/undefined
                src, which next/image throws on. */}
            {isLoading || !imageSrc ? (
                <div className="absolute inset-0 animate-pulse bg-[#2c2620]" />
            ) : (
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    className="object-cover object-center"
                />
            )}

            {/* Gradient overlay — darkest at left where text sits, fading toward the image */}
            <div className="absolute inset-0 bg-linear-to-r from-[#0f0b08]/90 via-[#0f0b08]/55 to-[#0f0b08]/10" />

            <Header />

            {/* Content */}
            <Container>
                <div className="relative z-10 flex w-full h-full items-center py-39">
                    <div className="max-w-xl">
                        {isLoading ? (
                            <HeroTextSkeleton />
                        ) : (
                            <>
                                <h1 className="text-[2.75rem] leading-[1.15] text-[#f2ead9] md:text-[3.4rem]">
                                    {headline.map((line) => (
                                        <span
                                            key={line}
                                            className="block font-bold text-[64px]"
                                            style={{ fontFamily: "var(--font-cormorant-upright)" }}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </h1>

                                <p className="mt-5 max-w-md text-base leading-relaxed text-white font-normal">
                                    {description}
                                </p>

                                <Link
                                    href={ctaHref}
                                    className="group mt-8 inline-flex items-center gap-2.5 bg-[#c9a06a] px-6 py-3.5 text-[11px] font-medium tracking-wide text-[#0f0b08] transition-colors hover:bg-[#d9b27f]"
                                >
                                    {ctaLabel.toUpperCase()}
                                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}