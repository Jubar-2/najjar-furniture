import PageBanner from "@/components/app/PageBanner";
import ContactHelpCategories from "@/components/app/contactUs/ContactHelpCategories";
import ContactFormPanel from "@/components/app/contactUs/Contactformpanel";
import ConnectChannels from "@/components/app/contactUs/Connectchannels";
import ContactCTA from "@/components/app/contactUs/Contactcta";
import Footer from "@/components/app/Footer";

export default function ContactPage() {
  return (
    <main>
      <PageBanner
        imageSrc="/images/contact-banner.jpg"
        title="Contact Us"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <ContactHelpCategories />
      <ContactFormPanel />
      <ConnectChannels />
      <ContactCTA />

      <Footer />
    </main>
  );
}