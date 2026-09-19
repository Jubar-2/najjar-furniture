import PageBanner from "@/components/app/PageBanner";
import AboutUs from "@/components/app/home/AboutUs";
import OurValues from "@/components/app/aboutUs/OurValues";
// import PortfolioShowcase from "@/components/site/PortfolioShowcase";
import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
// import LogoMarquee from "@/components/site/LogoMarquee";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("about-us"));
}

const testimonials = [
  {
    id: "1",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
    rating: 5,
    name: "MD. Rashed Ahmed",
    location: "Khulna, Bangladesh",
    avatarSrc: "/images/avatars/rashed-ahmed.jpg",
  },
  {
    id: "2",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding.",
    rating: 5,
    name: "Mrs. Fatema Khatun",
    location: "Dhaka, Bangladesh",
    avatarSrc: "/images/avatars/fatema-khatun-1.jpg",
  },
  {
    id: "3",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
    rating: 5,
    name: "Mrs. Fatema Khatun",
    location: "Dhaka, Bangladesh",
    avatarSrc: "/images/avatars/fatema-khatun-2.jpg",
  },
];

const logos = [
  { id: "1", src: "/images/logos/logo-1.png", alt: "Partner logo" },
  { id: "2", src: "/images/logos/logo-2.png", alt: "Partner logo" },
  { id: "3", src: "/images/logos/logo-3.png", alt: "Partner logo" },
  { id: "4", src: "/images/logos/logo-4.png", alt: "Partner logo" },
  { id: "5", src: "/images/logos/logo-5.png", alt: "Partner logo" },
];

export default async function AboutPage() {
  const banner = await getPageBanner("about-us");

  return (
    <main>
      <PageBanner
        imageSrc={banner?.image || "/images/about-banner.jpg"}
        title={banner?.title || "About Us"}
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <AboutUs imageSrc="/images/about-portrait.jpg" />

      <OurValues />

      {/* <PortfolioShowcase
        title="Our Craft in Action"
        images={[
          { src: "/images/portfolio-1.jpg", alt: "Wooden staircase and living room", href: "/portfolio/1" },
          { src: "/images/portfolio-2.jpg", alt: "Handcrafted wooden sofa", href: "/portfolio/2" },
          { src: "/images/portfolio-3.jpg", alt: "Living room armchairs", href: "/portfolio/3" },
          { src: "/images/portfolio-4.jpg", alt: "Round wooden dining table", href: "/portfolio/4" },
        ]}
      /> */}

      <TestimonialsSlider testimonials={testimonials} />

      {/* <LogoMarquee logos={logos} /> */}

      <Footer />
    </main>
  );
}