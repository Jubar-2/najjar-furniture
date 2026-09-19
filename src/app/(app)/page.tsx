import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { headers } from "next/headers";
import axios from "axios";

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
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata(await getPageMeta("home"));
}

// Resolve the base URL for server-side fetching from request headers
async function getBaseUrl() {
    const hdrs = await headers();
    const host = hdrs.get("host") ?? "localhost:3000";
    const proto = hdrs.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
}

async function serverFetch(baseUrl: string, path: string) {
    try {
        const { data } = await axios.get(`${baseUrl}${path}`);
        return data?.data?.content ?? data?.data ?? null;
    } catch {
        return null;
    }
}

export default async function Home() {
    const baseUrl = await getBaseUrl();
    const queryClient = new QueryClient();

    // Prefetch all home page sections in parallel on the server
    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: HOME_HERO_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/hero"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_LAYER1_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/layer1"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_LAYER2_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/layer2"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_LAYER3_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/layer3"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_PORTFOLIO_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/portfolio"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_ABOUT_QUERY_KEY,
            queryFn: () => serverFetch(baseUrl, "/api/page/home/about"),
        }),
        queryClient.prefetchQuery({
            queryKey: HOME_TESTIMONIALS_QUERY_KEY,
            queryFn: async () => {
                try {
                    const { data } = await axios.get(`${baseUrl}/api/testimonials`);
                    return data?.data ?? [];
                } catch {
                    return [];
                }
            },
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
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

            <Footer />
        </HydrationBoundary>
    );
}
