import Image from "next/image";
import Link from "next/link";

export interface PortfolioCardProps {
    mainImage: string;
    subImages?: [string, string, string] | string[];
    title: string;
    description: string;
    category?: string;
    href?: string;
    onClick?: () => void;
}

export default function PortfolioCard({
    mainImage,
    subImages,
    title,
    description,
    category,
    href,
    onClick,
}: PortfolioCardProps) {
    const card = (
        <div
            onClick={onClick}
            className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${onClick ? "cursor-pointer" : ""
                }`}
        >
            {/* Main image */}
            <div className="relative aspect-[16/10] w-full">
                <Image src={mainImage} alt={title} fill className="object-cover" />
                {category && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-white shadow-xs">
                        {category}
                    </span>
                )}
            </div>

            {/* 3 sub-images */}
            {(() => {
                const list =
                    subImages && subImages.length > 0
                        ? [...subImages]
                        : [mainImage, mainImage, mainImage];
                while (list.length < 3) {
                    list.push(mainImage);
                }
                const thumbs = list.slice(0, 3);
                return (
                    <div className="grid grid-cols-3 gap-1.5 p-1.5">
                        {thumbs.map((src, i) => (
                            <div key={i} className="relative aspect-4/3 overflow-hidden rounded-lg">
                                <Image src={src} alt={`${title} detail ${i + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Text */}
            <div className="px-6 pb-8 pt-4 text-center">
                <h3 className="text-xl font-bold text-[#6b3f22]">{title}</h3>
                <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed text-[#2b241f]/80">
                    {description}
                </p>
            </div>
        </div>
    );

    return href ? <Link href={href}>{card}</Link> : card;
}