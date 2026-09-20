import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import Testimonial from "@/models/testimonials.model";
import { unstable_cache } from "next/cache";

export interface HomeServerData {
    hero: any;
    layer1: any;
    layer2: any;
    layer3: any;
    portfolio: any;
    about: any;
    gallery: { images: any[]; imagesSub: any[] };
    testimonials: any[];
}

async function fetchHomeDataFromDb(): Promise<HomeServerData | null> {
    try {
        await dbConnect();

        const page = await PageModel.findOne({ pageName: "home" }).lean();
        if (!page) {
            return null;
        }

        const [sections, testimonials] = await Promise.all([
            PageSection.find({ pageId: page._id, isActive: true }).lean(),
            Testimonial.find().sort({ createdAt: -1 }).lean(),
        ]);

        const sectionMap = new Map<string, any>();
        for (const sec of sections) {
            if (sec.type) {
                sectionMap.set(sec.type, sec.content);
            }
        }

        // Return clean JSON-serializable plain object
        return JSON.parse(
            JSON.stringify({
                hero: sectionMap.get("banner") ?? null,
                layer1: sectionMap.get("home-layer-1") ?? null,
                layer2: sectionMap.get("home-layer-2") ?? null,
                layer3: sectionMap.get("home-layer-3") ?? null,
                portfolio: sectionMap.get("portfolio") ?? null,
                about: sectionMap.get("about") ?? null,
                gallery: sectionMap.get("gallery") ?? { images: [], imagesSub: [] },
                testimonials: testimonials ?? [],
            })
        );
    } catch (error) {
        console.error("fetchHomeDataFromDb failed:", error);
        return null;
    }
}

/**
 * Reads all active home page sections and testimonials directly from MongoDB,
 * cached for 15 minutes using Next.js unstable_cache.
 * This completely avoids headers(), loopback HTTP requests, and SSR latency.
 */
export const getCachedHomeData = unstable_cache(
    fetchHomeDataFromDb,
    ["home-page-data"],
    {
        revalidate: 900,
        tags: ["home-page-data", "page-sections"],
    }
);
