import Image from "next/image";
import Link from "next/link";
import Container from "@/components/utils/Container";

interface WoodFurnitureBannerProps {
    imageSrc: string;
    backgroundColor: string;
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export default function WoodFurnitureBanner({
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
        <section className={`w-full ${backgroundColor} mt-5`}>
            <Container>
                <div className="flex flex-col items-center pt-10 text-center md:pt-14">
                    <h2 className={`text-[48px] font-bold ${headingColor} md:text-[1.75rem]`}>
                        {title}
                    </h2>
                    <p className={`mt-2 max-w-sm text-[13px] leading-relaxed ${descriptionColor}`}>
                        {description}
                    </p>
                    <Link
                        href={ctaHref}
                        className="mt-4 rounded-full border border-[#3a2c22]/30 px-5 py-1.5 text-[10px] font-medium tracking-wide text-[#3a2c22] transition-colors hover:border-[#3a2c22] hover:bg-[#3a2c22] hover:text-[#f5efe4]"
                    >
                        {ctaLabel.toUpperCase()}
                    </Link>
                </div>
                <div className="w-full">
                    <Image src={imageSrc} alt="Wood Furniture" />
                </div>
            </Container>
        </section>
    );
}