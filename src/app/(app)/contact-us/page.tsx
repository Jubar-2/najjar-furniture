import PageBanner from "@/components/app/PageBanner";
import ContactHelpCategories from "@/components/app/contactUs/ContactHelpCategories";
import ContactFormPanel from "@/components/app/contactUs/Contactformpanel";
import ConnectChannels from "@/components/app/contactUs/Connectchannels";
import ContactCTA from "@/components/app/contactUs/Contactcta";
import Footer from "@/components/app/Footer";
import { getContactSection } from "./contact.server";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("contact"));
}

export default async function ContactPage() {
  const contact = await getContactSection();

  return (
    <main>
      <PageBanner
        imageSrc="/images/contact-banner.jpg"
        title="Contact Us"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <ContactHelpCategories topics={contact.topics} />
      <ContactFormPanel contact={contact} />
      <ConnectChannels socials={contact.socials} />
      <ContactCTA
        title={contact.cta.title}
        subtitle={contact.cta.subtitle}
        description={contact.cta.description}
        ctaLabel={contact.cta.ctaLabel}
        ctaHref={contact.cta.ctaHref}
      />

      <Footer />
    </main>
  );
}