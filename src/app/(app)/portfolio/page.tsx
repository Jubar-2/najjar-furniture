import PageBanner from "@/components/app/PageBanner";
import PortfolioGrid from "@/components/app/portfolio/PortfolioGrid";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import dbConnect from "@/db/dbConnect";
import PortfolioItem from "@/models/portfolioItem.model";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("portfolio"));
}

async function getPortfolioItems() {
  try {
    await dbConnect();
    const items = await PortfolioItem.find().sort({ createdAt: -1 }).lean();
    const formatted = items.map((item) => ({
      ...item,
      subImages: Array.isArray(item.subImages)
        ? item.subImages
            .map((s: any) => (typeof s === "string" ? s : s?.url))
            .filter(Boolean)
        : [],
    }));
    return JSON.parse(JSON.stringify(formatted));
  } catch (error) {
    console.error("Failed to load portfolio items on server:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const [banner, initialItems] = await Promise.all([
    getPageBanner("portfolio"),
    getPortfolioItems(),
  ]);

  return (
    <main>
      <PageBanner
        imageSrc={banner?.image || "/images/about-banner.jpg"}
        title={banner?.title || "Portfolio"}
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <PortfolioGrid initialItems={initialItems} />

      <Footer />
    </main>
  );
}