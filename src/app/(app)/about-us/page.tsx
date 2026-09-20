import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import PageBanner from "@/components/app/PageBanner";
import HomeAboutClient from "@/components/clint-components/home/HomeAboutClient";
import AboutTestimonialsClient from "@/components/clint-components/aboutUs/AboutTestimonialsClient";
import OurValues from "@/components/app/aboutUs/OurValues";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import { getCachedHomeData } from "@/services/homeData";
import { HOME_ABOUT_QUERY_KEY } from "@/customHooks/useHomeAbout";
import { HOME_TESTIMONIALS_QUERY_KEY } from "@/customHooks/useTestimonials";
import type { Metadata } from "next";

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("about-us"));
}

export default async function AboutPage() {
  const queryClient = new QueryClient();

  const [banner, homeData] = await Promise.all([
    getPageBanner("about-us"),
    getCachedHomeData(),
  ]);

  if (homeData) {
    queryClient.setQueryData(HOME_ABOUT_QUERY_KEY, homeData.about);
    queryClient.setQueryData(HOME_TESTIMONIALS_QUERY_KEY, homeData.testimonials);
  }

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