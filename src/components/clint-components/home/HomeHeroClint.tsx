"use client";

import Hero from "@/components/app/home/Hero";
import { useGetBanner } from "@/customHooks/getBanner";

export default function HomeHeroClint() {
    const { data, isLoading, error } = useGetBanner();

    // On a fetch error, fall back to Hero's own built-in defaults rather
    // than showing a broken/blank hero — the section still looks
    // intentional, it's just not the admin-edited content for this load.
    if (error) {
        console.error("Failed to load hero/banner content:", error);
        return <Hero />;
    }

    const content = data?.content;

    return (
        <Hero
            isLoading={isLoading}
            imageSrc={content?.banner}
            headline={content?.heading ? [content.heading] : undefined}
            description={content?.paragraph}
        />
    );
}