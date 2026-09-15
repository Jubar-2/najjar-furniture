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
        <section className="gallery bg-[#F98D550F] py-7.5">
            <div className="text-center p-4 max-w-103.75 mx-auto w-full mb-6.75">
                <h2 className="text-[#462514] text-[52px] font-bold">Our Gallery</h2>
                <p className="text-[#000000] text-base">
                    Discover our handcrafted furniture, where
                    timeless design meets exceptional craftsmanship.</p>
            </div>

            <div className="gallery-grid">
                <Swiper
                    modules={[Autoplay]}
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={20}
                    loop
                    loopAdditionalSlides={3}
                    speed={1200}
                    autoplay={{
                        delay: AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                    }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={img.publicId || index} className="!w-[60%]">
                            <img src={img.url} alt="" className="block w-full h-auto" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="w-full h-4 bg-white"></div>

                <Swiper
                    modules={[Autoplay]}
                    onSwiper={(s) => (swiperRef.current = s)}
                    onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    slidesPerView="auto"
                    spaceBetween={20}
                    loop
                    loopAdditionalSlides={5}
                    speed={1200}
                    autoplay={{
                        delay: AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                    }}
                >
                    {imagesSub.map((img, index) => (
                        <SwiperSlide key={img.publicId || index} className="!w-[23%]">
                            <div className="w-full">
                                <img src={img.url} alt="" className="block w-full h-auto" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigator: progress dots + play/pause toggle */}
                <div className="relative mt-4 flex items-center justify-center px-4">
                    <div className="flex items-center gap-2">
                        {imagesSub.map((_, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    onClick={() => swiperRef.current?.slideToLoop(index)}
                                    className={`relative overflow-hidden rounded-full bg-neutral-300 transition-all duration-300 ${isActive ? "h-1.5 w-8" : "h-1.5 w-1.5"
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
                    <div className="py-4 pb-7.25">
                        <button
                            type="button"
                            onClick={toggleAutoplay}
                            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                            className="absolute right-4 flex size-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-300"
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