import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import HomeHeroClint from "@/components/clint-components/home/HomeHeroClint";
import HomeLayersClient from "@/components/clint-components/home/HomeLayersClient";
import HomeGalleryClient from "@/components/clint-components/home/HomeGalleryClient";
import HomePortfolioClient from "@/components/clint-components/home/HomePortfolioClient";
import HomeTestimonialsClient from "@/components/clint-components/home/HomeTestimonialsClient";
import HomeLayer3Client from "@/components/clint-components/home/HomeLayer3Client";
import HomeAboutClient from "@/components/clint-components/home/HomeAboutClient";
import Footer from "@/components/app/Footer";

import { HOME_HERO_QUERY_KEY } from "@/customHooks/getBanner";
import { HOME_LAYER1_QUERY_KEY } from "@/customHooks/useHomeLayer1";
import { HOME_LAYER2_QUERY_KEY } from "@/customHooks/useHomeLayer2";
import { HOME_LAYER3_QUERY_KEY } from "@/customHooks/useHomeLayer3";
import { HOME_PORTFOLIO_QUERY_KEY } from "@/customHooks/usePortfolio";
import { HOME_TESTIMONIALS_QUERY_KEY } from "@/customHooks/useTestimonials";
import { HOME_ABOUT_QUERY_KEY } from "@/customHooks/useHomeAbout";
import { HOME_GALLERY_QUERY_KEY } from "@/customHooks/getGallery";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getCachedHomeData } from "@/services/homeData";
import type { Metadata } from "next";

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata(await getPageMeta("home"));
}

export default async function Home() {
    const homeData = await getCachedHomeData();
    const queryClient = new QueryClient();

    if (homeData) {
        queryClient.setQueryData(HOME_HERO_QUERY_KEY, homeData.hero);
        queryClient.setQueryData(HOME_LAYER1_QUERY_KEY, homeData.layer1);
        queryClient.setQueryData(HOME_LAYER2_QUERY_KEY, homeData.layer2);
        queryClient.setQueryData(HOME_LAYER3_QUERY_KEY, homeData.layer3);
        queryClient.setQueryData(HOME_PORTFOLIO_QUERY_KEY, homeData.portfolio);
        queryClient.setQueryData(HOME_ABOUT_QUERY_KEY, homeData.about);
        queryClient.setQueryData(HOME_GALLERY_QUERY_KEY, homeData.gallery);
        queryClient.setQueryData(HOME_TESTIMONIALS_QUERY_KEY, homeData.testimonials);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main>
                {/* Hero — dynamic from DB */}
                <HomeHeroClint />

                {/* Layer 1 & 2 banners — dynamic from DB */}
                <HomeLayersClient />

                {/* Product feature splits — dynamic from DB (layer 3) */}
                <HomeLayer3Client />

                {/* Gallery — dynamic from DB */}
                <HomeGalleryClient />

                {/* Portfolio showcase — dynamic from DB */}
                <HomePortfolioClient />

                {/* About Us — dynamic from DB */}
                <HomeAboutClient />

                {/* Testimonials — dynamic from DB */}
                <HomeTestimonialsClient />

                {/* <LogoMarquee logos={logos} /> */}
            </main>

            <Footer />
        </HydrationBoundary>
    );
}

