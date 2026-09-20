import { memo } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Container from "@/components/utils/Container";
import { optimizeCloudinaryUrl } from "@/lib/images";

interface WoodFurnitureBannerProps {
    imageSrc: string | StaticImageData;
    backgroundColor: string;
    title?: string;
    description?: string;
    descriptionColor?: string;
    headingColor?: string;
    textColor?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

function WoodFurnitureBanner({
    imageSrc,
    backgroundColor,
    title = "Wood Furniture",
    description = "Premium handcrafted wooden furniture, designed with precision and made to last.",
    descriptionColor,
    headingColor,
    ctaLabel = "View More",
    ctaHref = "/collection/wood-furniture",
}: WoodFurnitureBannerProps) {
    return (
        <section className={`w-full ${backgroundColor} mt-4 sm:mt-6 pb-6 sm:pb-10`}>
            <Container>
                <div className="flex flex-col items-center pt-8 sm:pt-12 md:pt-14 pb-4 sm:pb-6 text-center">
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight ${headingColor}`}>
                        {title}
                    </h2>
                    <p className={`mt-2 sm:mt-3 max-w-sm sm:max-w-md text-xs sm:text-[13.5px] leading-relaxed ${descriptionColor}`}>
                        {description}
                    </p>
                    {/* <Link
                        href={ctaHref}
                        className="mt-4 rounded-full border border-[#3a2c22]/30 px-5 sm:px-6 py-2 text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#3a2c22] transition-all hover:border-[#3a2c22] hover:bg-[#3a2c22] hover:text-[#f5efe4]"
                    >
                        {ctaLabel.toUpperCase()}
                    </Link> */}
                </div>
                <div className="w-full flex items-center justify-center px-2 sm:px-0">
                    <Image
                        src={typeof imageSrc === "string" ? optimizeCloudinaryUrl(imageSrc, { width: 800 }) : imageSrc}
                        alt={title || "Wood Furniture"}
                        width={735}
                        height={520}
                        sizes="(max-width: 768px) 100vw, 735px"
                        className="w-full max-w-183.75 h-auto object-contain"
                    />
                </div>
            </Container>
        </section>
    );
}

export default memo(WoodFurnitureBanner);