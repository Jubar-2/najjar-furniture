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
    <section className="relative h-[280px] w-full overflow-hidden bg-[#0f0b08] md:h-[340px]">
      <Image src={imageSrc} alt={imageAlt} fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-[#0f0b08]/70" />

      <Header />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-center">
        <h1 className="font-serif text-4xl text-[#f2ead9] md:text-5xl">{title}</h1>

        <nav className="flex items-center gap-1.5 text-[12px] text-[#f2ead9]/75">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <Link href={crumb.href} className="hover:text-[#f2ead9]">
                {crumb.label}
              </Link>
              {i < breadcrumb.length || true ? <ChevronRight className="size-3" /> : null}
            </span>
          ))}
          <span className="text-[#c9a06a]">{title}</span>
        </nav>
      </div>
    </section>
  );
}