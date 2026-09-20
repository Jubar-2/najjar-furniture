import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/app/Header";

interface PageBannerProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  breadcrumb?: { label: string; href: string }[];
}

export default function PageBanner({
  imageSrc,
  imageAlt = "",
  title,
  breadcrumb = [{ label: "Home", href: "/" }],
}: PageBannerProps) {
  return (
    <section className="relative min-h-65 sm:min-h-72.5 md:min-h-85 w-full bg-[#0f0b08] flex flex-col justify-center">
      {/* Background image & overlay - isolated overflow hidden so Header dropdown is not clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[#0f0b08]/75" />
      </div>

      <Header />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2.5 sm:gap-3 text-center pt-24 pb-8 sm:pt-28 sm:pb-10 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f2ead9] font-bold tracking-wide">
          {title}
        </h1>

        <nav className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-[13px] text-[#f2ead9]/80">
          {breadcrumb.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <Link href={crumb.href} className="transition-colors hover:text-[#f2ead9]">
                {crumb.label}
              </Link>
              <ChevronRight className="size-3 text-[#f2ead9]/50" />
            </span>
          ))}
          <span className="font-medium text-[#c9a06a]">{title}</span>
        </nav>
      </div>
    </section>
  );
}