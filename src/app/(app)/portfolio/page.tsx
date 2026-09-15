import PageBanner from "@/components/app/PageBanner";
import PortfolioGrid from "@/components/app/portfolio/PortfolioGrid";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("portfolio"));
}

export default function PortfolioPage() {
  return (
    <main>
      <PageBanner
        imageSrc="/images/about-banner.jpg"
        title="Portfolio"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <PortfolioGrid />

      <Footer />
    </main>
  );
}