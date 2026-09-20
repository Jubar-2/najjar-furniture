"use client";

import { useMemo } from "react";
import ProductFeatureSplit from "@/components/app/home/Productfeaturesplit";
import { useGetLayer3 } from "@/customHooks/useHomeLayer3";

const DEFAULT_BACKGROUNDS = [
    "bg-[linear-gradient(134.76deg,#B2B2B2_-7.4%,rgba(255,255,255,0.76)_108.48%)]",
    "bg-[linear-gradient(225.14deg,rgba(199,76,12,0.36)_-13.4%,rgba(255,255,255,0.41)_103.09%)]",
    "bg-[#F6CFCF]",
    "bg-[#DEFAFB]",
    "bg-[linear-gradient(134.76deg,#E5E5E5_-7.4%,rgba(0,98,210,0.3)_108.48%)]",
    "bg-[linear-gradient(135.6deg,#FFFFFF_2.35%,rgba(210,122,0,0.53)_120.28%)]",
];

export default function HomeLayer3Client() {
    const { data: layer3 } = useGetLayer3();

    const pairs = useMemo(() => {
        if (!layer3) return [];
        const items = [layer3.item1, layer3.item2, layer3.item3, layer3.item4, layer3.item5, layer3.item6];
        return [
            [items[0], items[1]],
            [items[2], items[3]],
            [items[4], items[5]],
        ];
    }, [layer3]);

    if (!layer3 || pairs.length === 0) return null;


    return (
        <>
            {pairs.map(([left, right], i) => (
                <ProductFeatureSplit
                    key={i}
                    left={{
                        imageSrc: left.image,
                        imageAlt: left.heading,
                        title: left.heading,
                        description: left.paragraph,
                        ctaHref: "/products",
                        background: DEFAULT_BACKGROUNDS[i * 2],
                    }}
                    right={{
                        imageSrc: right.image,
                        imageAlt: right.heading,
                        title: right.heading,
                        description: right.paragraph,
                        ctaHref: "/products",
                        background: DEFAULT_BACKGROUNDS[i * 2 + 1],
                    }}
                />
            ))}
        </>
    );
}
