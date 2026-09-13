import Hero from "@/components/app/home/Hero";
import Banner from "../../assets/image/banner/banner.jpg";
import WoodFurnitureBanner from "@/components/app/home/WoodFurnitureBanner";
import SoodFurniture from "@/assets/image/product/wood-furniture.png";
import ProductFeatureSplit from "@/components/app/home/Productfeaturesplit";
import Gallery from "@/components/app/home/Gallery";
import PortfolioShowcase from "@/components/control-panel/pages/home/Portfolioshowcase";
import Bad01 from "@/assets/image/product/bad01.png";
import portfolio0 from "@/assets/image/product/port0.png";
import portfolio1 from "@/assets/image/product/port1.png";
import portfolio2 from "@/assets/image/product/port2.png";
import portfolio3 from "@/assets/image/product/port3.png";
import AboutUs from "@/components/app/home/AboutUs";
import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
import LogoMarquee from "@/components/app/home/LogoMarquee";
import Footer from "@/components/app/Footer";
import About from "@/assets/image/banner/about.png";
import profile from "@/assets/image/profile/jon.jpg";
import WoodWork from "@/assets/image/logo/woodWork.png";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import HomeHeroClint from "@/components/clint-components/home/HomeHeroClint";

const testimonials = [
    {
        id: "1",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "MD. Rashed Ahmed",
        location: "Khulna, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "2",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "3",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "4",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "5",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
];

const logos = [
    { id: "1", src: WoodWork, alt: "Woodwork" },
    // { id: "2", src: "/images/logos/wooden-1.png", alt: "Wooden" },
    // { id: "3", src: "/images/logos/wood-work-badge.png", alt: "Wood Work" },
    // { id: "4", src: "/images/logos/woodwork-saw.png", alt: "Woodwork" },
    // { id: "5", src: "/images/logos/woodwork-2.png", alt: "Woodwork Premium Quality" },
    // { id: "6", src: "/images/logos/wooden-2.png", alt: "Wooden" },
    // { id: "7", src: "/images/logos/wood-work-ring.png", alt: "Wood Work" },
    // { id: "8", src: "/images/logos/woodwork-badge-1.png", alt: "Woodwork" },
    // { id: "9", src: "/images/logos/woodwork-badge-2.png", alt: "Woodwork Premium Quality" },
    // { id: "10", src: "/images/logos/wooden-3.png", alt: "Wooden" },
    // { id: "11", src: "/images/logos/woodwork-saw-badge.png", alt: "Woodwork" },
];

export default async function Home() {

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["banner"], // <-- confirm this matches useGetBanner()'s key
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sections/banner`);
            if (!res.ok) throw new Error("Failed to fetch banner");
            return res.json();
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HomeHeroClint />
            <WoodFurnitureBanner
                imageSrc={SoodFurniture}
                title="Wood Furniture"
                description="Premium handcrafted wooden furniture, designed with precision and made to last."
                backgroundColor="bg-[#F2EBE0B2]"
                textColor="text-[#000000]"
                headingColor="text-[#462514]"
            />

            <WoodFurnitureBanner
                imageSrc={SoodFurniture}
                backgroundColor="bg-[#6161613D]"
                title="Our Collection"
                description="Explore our collection of timeless wooden furniture, crafted with quality, elegance, and attention to detail."
                textColor="text-[#000000]"
                headingColor="text-[#462514]"
            />

            <ProductFeatureSplit
                left={{
                    imageSrc: { Bad01 },
                    imageAlt: "Shaker raised panel bed",
                    title: "Shaker Raised Panel Bed",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-vylPCtd8OoyvQAY9dZbChqcJua89iV0oDaV_RsZX-SLDiCzishZmulU&s=10",
                    background: "bg-[linear-gradient(134.76deg,#B2B2B2_-7.4%,rgba(255,255,255,0.76)_108.48%)]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-[linear-gradient(225.14deg,rgba(199,76,12,0.36)_-13.4%,rgba(255,255,255,0.41)_103.09%)]",
                }}
            />

            <ProductFeatureSplit
                left={{
                    imageSrc: "/images/shaker-bed.png",
                    imageAlt: "Our Collection",
                    title: "Our Collection",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/shaker-raised-panel-bed",
                    background: "bg-[#F6CFCF]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-[#DEFAFB]",
                }}
            />

            <ProductFeatureSplit
                left={{
                    imageSrc: "/images/shaker-bed.png",
                    imageAlt: "Shaker raised panel bed",
                    title: "Shaker Raised Panel Bed",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/shaker-raised-panel-bed",
                    background: "bg-[linear-gradient(134.76deg,#E5E5E5_-7.4%,rgba(0,98,210,0.3)_108.48%)]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-[linear-gradient(135.6deg,#FFFFFF_2.35%,rgba(210,122,0,0.53)_120.28%)]",
                }}
            />

            <Gallery />

            <PortfolioShowcase
                images={[
                    { src: portfolio0, alt: "Wooden staircase and living room", href: "/portfolio/1", width: "w-[220px]" },
                    { src: portfolio1, alt: "Handcrafted wooden sofa", href: "/portfolio/2", width: 379 },
                    { src: portfolio2, alt: "Living room armchairs", href: "/portfolio/3", width: 300 },
                    { src: portfolio3, alt: "Round wooden dining table", href: "/portfolio/4", width: 300 },
                ]}
            />

            <AboutUs imageSrc={About} />

            <TestimonialsSlider
                testimonials={testimonials}
                title="Our Testimonials"
                description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
            />

            {/* <LogoMarquee logos={logos} />    */}

            <Footer />
        </HydrationBoundary>


    );
}
