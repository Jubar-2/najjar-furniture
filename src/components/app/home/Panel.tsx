import Image from "next/image";
import Link from "next/link";
import { optimizeCloudinaryUrl } from "@/lib/images";

export interface ProductPanel {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref: string;
  background: string; // tailwind bg/gradient classes for this panel
}

export function Panel({
  imageSrc,
  imageAlt,
  title,
  description,
  ctaLabel = "Learn More",
  ctaHref,
  background,
}: ProductPanel) {
  return (
    <div className={`relative flex flex-col items-center px-4 sm:px-8 pb-5 pt-8 sm:pt-10 text-center overflow-hidden shadow-xs ${background}`}>
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#2b241f]">{title}</h3>
      <p className="mt-2 max-w-70 sm:max-w-xs text-xs sm:text-[13px] leading-relaxed text-[#2b241f]/75">
        {description}
      </p>
      {/* <Link
        href={ctaHref}
        className="mt-4 rounded-full border border-[#2b241f]/30 px-5 py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#2b241f] transition-all hover:border-[#2b241f] hover:bg-[#2b241f] hover:text-white"
      >
        {ctaLabel.toUpperCase()}
      </Link> */}

      <div className="relative mt-6 h-52 sm:h-64 md:h-80 w-full max-w-[320px]">
        <Image
          src={optimizeCloudinaryUrl(imageSrc, { width: 640 })}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 90vw, 320px"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}