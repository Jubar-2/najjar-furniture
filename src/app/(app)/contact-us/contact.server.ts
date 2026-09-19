import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { DEFAULT_CONTACT } from "@/lib/contact";
import type { ContactSection } from "@/schemas/contact.schema";
import { unstable_cache } from "next/cache";

async function fetchContactSectionFromDb(): Promise<ContactSection> {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: "contact" });
    if (!page) return DEFAULT_CONTACT;

    const section = await PageSection.findOne({
        pageId: page._id,
        type: "contact",
        isActive: true,
    }).lean();

    const stored = section?.content as Partial<ContactSection> | null | undefined;
    if (!stored) return DEFAULT_CONTACT;

    return {
        ...DEFAULT_CONTACT,
        ...stored,
        cta: { ...DEFAULT_CONTACT.cta, ...(stored.cta ?? {}) },
    };
}

export async function getContactSection(): Promise<ContactSection> {
    try {
        const getCachedContact = unstable_cache(
            fetchContactSectionFromDb,
            ["contact-section"],
            {
                revalidate: 900,
                tags: ["contact-section"],
            }
        );

        return await getCachedContact();
    } catch (error) {
        console.error("Failed to load contact section:", error);
        return DEFAULT_CONTACT;
    }
}