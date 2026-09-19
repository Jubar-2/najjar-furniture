"use client";

import AboutUs from "@/components/app/home/AboutUs";
import DefaultAboutImage from "@/assets/image/banner/about.png";
import { useGetHomeAbout } from "@/customHooks/useHomeAbout";

export default function HomeAboutClient() {
    const { data: about, isLoading, error } = useGetHomeAbout();

    if (error) {
        console.error("Failed to load about section content:", error);
    }

    return (
        <AboutUs
            imageSrc={about?.image?.url || DefaultAboutImage}
            description={about?.paragraph}
            isLoading={isLoading}
        />
    );
}
