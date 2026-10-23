import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { DEFAULT_CONTACT } from "@/lib/contact";
import type { ContactSection } from "@/schemas/contact.schema";

export async function fetchContactSectionFromDb(): Promise<ContactSection> {
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
        emails: Array.isArray(stored.emails) ? stored.emails : DEFAULT_CONTACT.emails,
        phones: Array.isArray(stored.phones) ? stored.phones : DEFAULT_CONTACT.phones,
        whatsapps: Array.isArray(stored.whatsapps) ? stored.whatsapps : DEFAULT_CONTACT.whatsapps,
        socials: Array.isArray(stored.socials) ? stored.socials : DEFAULT_CONTACT.socials,
        topics: Array.isArray(stored.topics) ? stored.topics : DEFAULT_CONTACT.topics,
        address: typeof stored.address === "string" ? stored.address : DEFAULT_CONTACT.address,
        showroomHours: typeof stored.showroomHours === "string" ? stored.showroomHours : DEFAULT_CONTACT.showroomHours,
        responseTimes: Array.isArray(stored.responseTimes) ? stored.responseTimes : DEFAULT_CONTACT.responseTimes,
        cta: {
            title: stored.cta?.title ?? DEFAULT_CONTACT.cta.title,
            subtitle: stored.cta?.subtitle ?? DEFAULT_CONTACT.cta.subtitle,
            description: stored.cta?.description ?? DEFAULT_CONTACT.cta.description,
            ctaLabel: stored.cta?.ctaLabel ?? DEFAULT_CONTACT.cta.ctaLabel,
            ctaHref: stored.cta?.ctaHref ?? DEFAULT_CONTACT.cta.ctaHref,
        },
    };
}

export async function getContactSection(): Promise<ContactSection> {
    try {
        return await fetchContactSectionFromDb();
    } catch (error) {
        console.error("Failed to load contact section dynamically:", error);
        return DEFAULT_CONTACT;
    }
}
