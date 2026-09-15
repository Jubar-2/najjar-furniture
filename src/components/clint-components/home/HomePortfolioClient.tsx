"use client";

import PortfolioShowcase from "@/components/control-panel/pages/home/Portfolioshowcase";
import portfolio0 from "@/assets/image/product/port0.png";
import portfolio1 from "@/assets/image/product/port1.png";
import portfolio2 from "@/assets/image/product/port2.png";
import portfolio3 from "@/assets/image/product/port3.png";
import { useGetPortfolio } from "@/customHooks/usePortfolio";
import { StaticImageData } from "next/image";

interface PortfolioCardImage {
    src: string | StaticImageData;
    alt: string;
    href: string;
    width?: string | number;
}

/** Fallback static images when the API has no content yet */
const FALLBACK_IMAGES: PortfolioCardImage[] = [
    { src: portfolio0, alt: "Wooden staircase and living room", href: "/portfolio", width: "w-[220px]" },
    { src: portfolio1, alt: "Handcrafted wooden sofa", href: "/portfolio", width: 379 },
    { src: portfolio2, alt: "Living room armchairs", href: "/portfolio", width: 300 },
    { src: portfolio3, alt: "Round wooden dining table", href: "/portfolio", width: 300 },
];

export default function HomePortfolioClient() {
    const { data } = useGetPortfolio();

    const images: PortfolioCardImage[] = data
        ? [
              data.image1 && ({ src: data.image1.url, alt: "Portfolio 1", href: "/portfolio", width: "w-[220px]" } as PortfolioCardImage),
              data.image2 && ({ src: data.image2.url, alt: "Portfolio 2", href: "/portfolio", width: 379 } as PortfolioCardImage),
              data.image3 && ({ src: data.image3.url, alt: "Portfolio 3", href: "/portfolio", width: 300 } as PortfolioCardImage),
              data.image4 && ({ src: data.image4.url, alt: "Portfolio 4", href: "/portfolio", width: 300 } as PortfolioCardImage),
          ].filter((img): img is PortfolioCardImage => Boolean(img))
        : FALLBACK_IMAGES;

    return <PortfolioShowcase images={images} />;
}
