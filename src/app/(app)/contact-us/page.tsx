import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import PageBanner from "@/components/app/PageBanner";
import ContactHelpCategories from "@/components/app/contactUs/ContactHelpCategories";
import ContactFormPanel from "@/components/app/contactUs/Contactformpanel";
import ConnectChannels from "@/components/app/contactUs/Connectchannels";
import ContactCTA from "@/components/app/contactUs/Contactcta";
import Footer from "@/components/app/Footer";
import { getContactSection } from "./contact.server";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import { CONTACT_QUERY_KEY } from "@/customHooks/useContact";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("contact"));
}

export default async function ContactPage() {
  const [contact, banner] = await Promise.all([
    getContactSection(),
    getPageBanner("contact"),
  ]);

  const queryClient = new QueryClient();
  queryClient.setQueryData(CONTACT_QUERY_KEY, contact);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <PageBanner
          imageSrc={banner?.image || "/images/contact-banner.jpg"}
          title={banner?.title || "Contact Us"}
          breadcrumb={[{ label: "Home", href: "/" }]}
        />

        <ContactHelpCategories topics={contact.topics} />
        <ContactFormPanel contact={contact} />
        <ConnectChannels socials={contact.socials} />
        <ContactCTA
          title={contact.cta?.title}
          subtitle={contact.cta?.subtitle}
          description={contact.cta?.description}
          ctaLabel={contact.cta?.ctaLabel}
          ctaHref={contact.cta?.ctaHref}
        />

        <Footer initialContact={contact} />
      </main>
    </HydrationBoundary>
  );
}
