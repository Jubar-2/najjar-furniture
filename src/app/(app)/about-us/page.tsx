import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { headers } from "next/headers";
import axios from "axios";

import PageBanner from "@/components/app/PageBanner";
import HomeAboutClient from "@/components/clint-components/home/HomeAboutClient";
import AboutTestimonialsClient from "@/components/clint-components/aboutUs/AboutTestimonialsClient";
import OurValues from "@/components/app/aboutUs/OurValues";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import { HOME_ABOUT_QUERY_KEY } from "@/customHooks/useHomeAbout";
import { HOME_TESTIMONIALS_QUERY_KEY } from "@/customHooks/useTestimonials";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("about-us"));
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

export default async function AboutPage() {
  const baseUrl = await getBaseUrl();
  const queryClient = new QueryClient();

  const [banner] = await Promise.all([
    getPageBanner("about-us"),
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
      <main>
        <PageBanner
          imageSrc={banner?.image || "/images/about-banner.jpg"}
          title={banner?.title || "About Us"}
          breadcrumb={[{ label: "Home", href: "/" }]}
        />

        <HomeAboutClient />

        <OurValues />

        <AboutTestimonialsClient />

        <Footer />
      </main>
    </HydrationBoundary>
  );
}