import Image from "next/image";
import Link from "next/link";

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
    <div className={`relative flex flex-col items-center px-8 pb-0 pt-10 text-center ${background}`}>
      <h3 className="text-lg font-semibold text-[#2b241f] md:text-xl">{title}</h3>
      <p className="mt-2 max-w-[280px] text-[12px] leading-relaxed text-[#2b241f]/70">
        {description}
      </p>
      <Link
        href={ctaHref}
        className="mt-4 rounded-full border border-[#2b241f]/30 px-5 py-1.5 text-[9px] font-medium tracking-wide text-[#2b241f] transition-colors hover:border-[#2b241f] hover:bg-[#2b241f] hover:text-white"
      >
        {ctaLabel.toUpperCase()}
      </Link>

      <div className="relative mt-6 h-65 w-full max-w-[320px] md:h-80">
        <Image src={imageSrc} alt={imageAlt} fill className="object-contain object-bottom" />
      </div>
    </div>
  );
}