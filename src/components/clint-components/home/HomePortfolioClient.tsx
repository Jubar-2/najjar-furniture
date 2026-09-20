"use client";

import { useMemo } from "react";
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

    const images: PortfolioCardImage[] = useMemo(() => {
        if (!data) return FALLBACK_IMAGES;
        return [
            data.image1?.url
                ? { src: data.image1.url, alt: "Portfolio 1", href: "/portfolio", width: "w-[220px]" }
                : FALLBACK_IMAGES[0],
            data.image2?.url
                ? { src: data.image2.url, alt: "Portfolio 2", href: "/portfolio", width: 379 }
                : FALLBACK_IMAGES[1],
            data.image3?.url
                ? { src: data.image3.url, alt: "Portfolio 3", href: "/portfolio", width: 300 }
                : FALLBACK_IMAGES[2],
            data.image4?.url
                ? { src: data.image4.url, alt: "Portfolio 4", href: "/portfolio", width: 300 }
                : FALLBACK_IMAGES[3],
        ];
    }, [data]);

    const paragraph = useMemo(() => {
        return data?.paragraph && data.paragraph.replace(/<[^>]*>/g, "").trim()
            ? data.paragraph
            : undefined;
    }, [data?.paragraph]);

    return <PortfolioShowcase images={images} description={paragraph} />;
}

