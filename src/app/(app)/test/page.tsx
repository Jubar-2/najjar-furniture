"use client";
import Hero from "@/components/app/home/Hero";
import Banner from "@/assets/image/banner/banner.jpg";
import WoodFurnitureBanner from "@/components/app/home/WoodFurnitureBanner";
import SoodFurniture from "@/assets/image/product/wood-furniture.png";
import ProductFeatureSplit from "@/components/app/home/Productfeaturesplit";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export const spotlightSlides: SpotlightSlide[] = [
  {
    id: "matter",
    imageSrc: "/images/matter.jpg",
    imageAlt: "Matter — Apple TV series",
    href: "/watch/matter",
    logoLabel: " tv",
  },
  {
    id: "f1-italian-gp",
    imageSrc: "/images/italian-grand-prix-2026.jpg",
    imageAlt: "F1 Italian Grand Prix 2026 on Apple TV",
    href: "/watch/f1-italian-grand-prix-2026",
    logoLabel: "F1 |  tv",
    title: ["ITALIAN", "GRAND PRIX", "2026"],
    eyebrow: "F1 on Apple TV",
    description: "Every Grand Prix™, live and on demand—all in one place, all year long.",
  },
  {
    id: "sci-fi-drama",
    imageSrc: "/images/sci-fi-drama.jpg",
    imageAlt: "Sci-Fi drama — the truth lies in the past",
    href: "/watch/sci-fi-drama",
    eyebrow: "Stream now",
    description: "Sci-Fi • The truth lies in the past.",
  },
];

export const cardSlides: CardSlide[] = [
  {
    id: "sabrina-carpenter-zane-lowe",
    imageSrc: "/images/sabrina-carpenter-zane-lowe.jpg",
    imageAlt: "Sabrina Carpenter & Zane Lowe",
    href: "/listen/sabrina-carpenter-zane-lowe",
    badgeLabel: " Music",
    title: "Sabrina Carpenter & Zane Lowe",
    subtitle: "The Zane Lowe Interview",
    ctaLabel: "Listen now",
  },
  {
    id: "hello-kitty-island-adventure",
    imageSrc: "/images/hello-kitty-island-adventure.jpg",
    imageAlt: "Hello Kitty Island Adventure",
    href: "/play/hello-kitty-island-adventure",
    badgeLabel: " Arcade",
    title: "Hello Kitty Island Adventure",
    ctaLabel: "Play now",
  },
  {
    id: "david-bowie",
    imageSrc: "/images/david-bowie.jpg",
    imageAlt: "David Bowie",
    href: "/fitness/david-bowie",
    badgeLabel: " Fitness+",
    title: "David Bowie",
    ctaLabel: "Watch now",
  },
  {
    id: "a-list-pop",
    imageSrc: "/images/a-list-pop.jpg",
    imageAlt: "A-List Pop — Pop Pop Pop",
    href: "/listen/a-list-pop",
    badgeLabel: " Music",
    title: "A-List Pop",
    ctaLabel: "Listen now",
  },
  {
    id: "powerwash-simulator",
    imageSrc: "/images/powerwash-simulator.jpg",
    imageAlt: "PowerWash Simulator",
    href: "/play/powerwash-simulator",
    badgeLabel: " Arcade",
    title: "PowerWash Simulator",
    ctaLabel: "Play now",
  },
];

export default function Home() {
    return (
        <>
            <Hero imageSrc={Banner} />
            <WoodFurnitureBanner imageSrc={SoodFurniture} backgroundColor="bg-[#F2EBE0B2]" />
            <WoodFurnitureBanner imageSrc={SoodFurniture} backgroundColor="bg-[#6161613D]" />
            <ProductFeatureSplit
                left={{
                    imageSrc: "/images/shaker-bed.png",
                    imageAlt: "Shaker raised panel bed",
                    title: "Shaker Raised Panel Bed",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/shaker-raised-panel-bed",
                    background: "bg-[#e7e6e3]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-gradient-to-br from-[#f6ddd0] via-[#faeee6] to-white",
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
                    background: "bg-[#e7e6e3]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-gradient-to-br from-[#f6ddd0] via-[#faeee6] to-white",
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
                    background: "bg-[#e7e6e3]",
                }}
                right={{
                    imageSrc: "/images/wave-front-chest.png",
                    imageAlt: "3-drawer wave-front accent chest",
                    title: "3-Drawer Wave-Front Accent Chest",
                    description:
                        "It features an antique honey or walnut finish, traditional iron ring pull handles.",
                    ctaHref: "/products/wave-front-accent-chest",
                    background: "bg-gradient-to-br from-[#f6ddd0] via-[#faeee6] to-white",
                }}
            />

            <DiscoverySlider spotlightSlides={spotlightSlides} cardSlides={cardSlides} />
        </>
    );
}



interface DiscoverySliderProps {
  title?: string;
  spotlightSlides: SpotlightSlide[];
  cardSlides: CardSlide[];
}

 function DiscoverySlider({
  title = "Endless entertainment.",
  spotlightSlides,
  cardSlides,
}: DiscoverySliderProps) {
  return (
    <section className="w-full bg-white py-8">
      <h2 className="mb-6 text-center text-[2rem] font-semibold text-neutral-900 md:text-[2.5rem]">
        {title}
      </h2>

      <div className="space-y-4">
        <SpotlightCarousel slides={spotlightSlides} />
        <CardCarousel slides={cardSlides} className="px-4" />
      </div>
    </section>
  );
}






import "swiper/css";
import "swiper/css/pagination";

export interface CardSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  badgeLabel?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
}

interface CardCarouselProps {
  slides: CardSlide[];
  className?: string;
  autoplayDelay?: number;
}

 function CardCarousel({
  slides,
  className = "",
  autoplayDelay = 3200,
}: CardCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAutoplay = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (isPlaying) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
    setIsPlaying((v) => !v);
  };

  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay, Pagination]}
        onSwiper={(s) => (swiperRef.current = s)}
        loop
        allowTouchMove={false}
        spaceBetween={12}
        slidesPerView={1.35}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4.3 },
        }}
        speed={700}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: false }}
        pagination={{ clickable: true, el: ".card-carousel-pagination" }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="h-[170px] overflow-hidden rounded-xl">
            <Link href={slide.href} className="relative block h-full w-full">
              <Image src={slide.imageSrc} alt={slide.imageAlt} fill className="object-cover" />

              {slide.badgeLabel && (
                <span className="absolute right-3 top-2.5 text-[11px] font-medium text-white/90">
                  {slide.badgeLabel}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">{slide.title}</p>
                  {slide.subtitle && (
                    <p className="truncate text-[11px] text-white/75">{slide.subtitle}</p>
                  )}
                </div>

                {slide.ctaLabel && (
                  <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-black">
                    {slide.ctaLabel}
                  </span>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots + play/pause toggle — matches the reference's bottom-right control */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <div className="card-carousel-pagination flex items-center gap-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-neutral-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-4 [&_.swiper-pagination-bullet-active]:bg-neutral-800" />

        <button
          type="button"
          onClick={toggleAutoplay}
          aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
          className="flex size-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-300"
        >
          {isPlaying ? (
            <Pause className="size-3" fill="currentColor" />
          ) : (
            <Play className="size-3" fill="currentColor" />
          )}
        </button>
      </div>
    </div>
  );
}





export interface SpotlightSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  logoLabel?: string;
  eyebrow?: string;
  title?: string[];
  description?: string;
  overlay?: "dark" | "none";
}

interface SpotlightCarouselProps {
  slides: SpotlightSlide[];
  className?: string;
  autoplayDelay?: number;
}

function SpotlightCarousel({
  slides,
  className = "",
  autoplayDelay = 4500,
}: SpotlightCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay]}
        onSwiper={(s) => (swiperRef.current = s)}
        loop
        allowTouchMove={false}
        centeredSlides
        spaceBetween={0}
        slidesPerView={1.08}
        breakpoints={{
          640: { slidesPerView: 1.3 },
          1024: { slidesPerView: 1.62 },
        }}
        speed={900}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="px-1">
            <Link
              href={slide.href}
              className="relative block h-[380px] w-full overflow-hidden lg:h-[420px]"
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                priority
              />
              {slide.overlay !== "none" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              )}

              {slide.logoLabel && (
                <span className="absolute right-4 top-4 text-sm font-medium text-white/90">
                  {slide.logoLabel}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5">
                {slide.title && (
                  <h3 className="text-2xl font-extrabold uppercase leading-[1.05] text-white sm:text-3xl">
                    {slide.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                )}

                {slide.eyebrow && slide.description ? (
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      {slide.eyebrow}
                    </span>
                    <span className="text-[13px] text-white/90">{slide.description}</span>
                  </div>
                ) : slide.eyebrow ? (
                  <span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {slide.eyebrow}
                  </span>
                ) : null}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}