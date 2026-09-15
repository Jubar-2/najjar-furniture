import Image from "next/image";
import Link from "next/link";

export interface PortfolioCardProps {
    mainImage: string;
    subImages: [string, string, string];
    title: string;
    description: string;
    href?: string;
}

export default function PortfolioCard({
    mainImage,
    subImages,
    title,
    description,
}: PortfolioCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]">
            {/* Main image */}
            <div className="relative aspect-16/10 w-full">
                <Image src={mainImage} alt={title} fill className="object-cover" />
            </div>

            {/* 3 sub-images */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5">
                {subImages.map((src, i) => (
                    <div key={i} className="relative aspect-4/3 overflow-hidden rounded-lg">
                        <Image src={src} alt={`${title} detail ${i + 1}`} fill className="object-cover" />
                    </div>
                ))}
            </div>

            {/* Text */}
            <div className="px-6 pb-8 pt-4 text-center">
                <h3 className="text-xl font-bold text-[#6b3f22]">{title}</h3>
                <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed text-[#2b241f]/80">
                    {description}
                </p>
            </div>
        </div>
    );


}