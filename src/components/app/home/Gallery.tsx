"use client";

import { useEffect, useRef, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pause, Play } from "lucide-react";

import type { GalleryImage } from "@/customHooks/getGallery";

import "swiper/css";

const AUTOPLAY_DELAY = 3000;

interface GalleryProps {
    isLoading?: boolean;
    images?: GalleryImage[];
    imagesSub?: GalleryImage[];
}

export default function Gallery({ isLoading, images = [], imagesSub = [] }: GalleryProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0); // 0 -> 100 fill of the active dot

    // Drives the fill-progress inside the active dot, synced to autoplay's delay.
    // Resets to 0 whenever the active slide changes, and freezes when paused.
    useEffect(() => {
        if (!isPlaying) return;

        const start = performance.now();
        let frame: number;

        const tick = (now: number) => {
            const elapsed = now - start;
            const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
            setProgress(pct);
            if (pct < 100) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex, isPlaying]);

    if (isLoading) return <section className="gallery bg-[#F98D550F] py-7.5" />;
    if (images.length === 0 && imagesSub.length === 0) return null;

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
        <section className="gallery bg-[#F98D550F] py-8 sm:py-12">
            <div className="text-center p-4 max-w-xl mx-auto w-full mb-4 sm:mb-6">
                <h2 className="text-[#462514] text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight">Our Gallery</h2>
                <p className="text-[#000000] text-sm sm:text-base mt-2">
                    Discover our handcrafted furniture, where
                    timeless design meets exceptional craftsmanship.</p>
            </div>

            <div className="gallery-grid">
                <Swiper
                    modules={[Autoplay]}
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={16}
                    loop
                    loopAdditionalSlides={3}
                    speed={1200}
                    autoplay={{
                        delay: AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                    }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={img.publicId || index} className="w-[85%]! sm:w-[75%]! md:w-[60%]!">
                            <img src={img.url} alt="Gallery" className="block w-full h-auto rounded-xl object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="w-full h-3 sm:h-4 bg-white"></div>

                <Swiper
                    modules={[Autoplay]}
                    onSwiper={(s) => (swiperRef.current = s)}
                    onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    slidesPerView="auto"
                    spaceBetween={14}
                    loop
                    loopAdditionalSlides={5}
                    speed={1200}
                    autoplay={{
                        delay: AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                    }}
                >
                    {imagesSub.map((img, index) => (
                        <SwiperSlide key={img.publicId || index} className="w-[55%]! sm:w-[38%]! md:w-[28%]! lg:w-[23%]!">
                            <div className="w-full">
                                <img src={img.url} alt="Gallery thumbnail" className="block w-full h-auto rounded-lg object-cover" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigator: progress dots + play/pause toggle */}
                <div className="relative mt-5 flex items-center justify-center px-4">
                    <div className="flex items-center gap-2 max-w-[70vw] overflow-x-auto py-1">
                        {imagesSub.map((_, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    onClick={() => swiperRef.current?.slideToLoop(index)}
                                    className={`relative shrink-0 overflow-hidden rounded-full bg-neutral-300 transition-all duration-300 ${isActive ? "h-1.5 w-7 sm:w-8" : "h-1.5 w-1.5"
                                        }`}
                                >
                                    {isActive && (
                                        <span
                                            className="absolute inset-y-0 left-0 rounded-full bg-neutral-800"
                                            style={{ width: `${progress}%` }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="ml-3 sm:ml-4">
                        <button
                            type="button"
                            onClick={toggleAutoplay}
                            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                            className="flex size-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-300 shadow-xs"
                        >
                            {isPlaying ? (
                                <Pause className="size-3" fill="currentColor" />
                            ) : (
                                <Play className="size-3" fill="currentColor" />
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}