"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pause, Play } from "lucide-react";

import type { GalleryImage } from "@/customHooks/getGallery";

import "swiper/css";

const AUTOPLAY_DELAY = 3000;
const SLIDE_SPEED = 1200;

interface GalleryProps {
    isLoading?: boolean;
    images?: GalleryImage[];
    imagesSub?: GalleryImage[];
}

export default function Gallery({ isLoading, images = [], imagesSub = [] }: GalleryProps) {
    const swiper1Ref = useRef<SwiperType | null>(null);
    const swiper2Ref = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0); // 0 -> 100 fill of the active dot

    const isSyncingRef = useRef(false);

    // Fallback if one list is empty so both sliders always have content
    const mainList = useMemo(() => (images.length > 0 ? images : imagesSub), [images, imagesSub]);
    const subList = useMemo(() => (imagesSub.length > 0 ? imagesSub : images), [images, imagesSub]);

    // Align total slide count so both sliders stay 1:1 synchronized at all times
    const totalSlides = useMemo(() => Math.max(mainList.length, subList.length), [mainList, subList]);

    const normalizedMainImages = useMemo(() => {
        if (totalSlides === 0) return [];
        return Array.from({ length: totalSlides }, (_, i) => mainList[i % mainList.length]);
    }, [mainList, totalSlides]);

    const normalizedSubImages = useMemo(() => {
        if (totalSlides === 0) return [];
        return Array.from({ length: totalSlides }, (_, i) => subList[i % subList.length]);
    }, [subList, totalSlides]);

    // Drives the fill-progress inside the active dot, synced to autoplay's delay,
    // and simultaneously advances both sliders when the delay elapses.
    useEffect(() => {
        if (!isPlaying || totalSlides <= 1) return;

        const start = performance.now();
        let frame: number;

        const tick = (now: number) => {
            const elapsed = now - start;
            const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
            setProgress(pct);

            if (pct < 100) {
                frame = requestAnimationFrame(tick);
            } else {
                // Simultaneously advance both sliders
                isSyncingRef.current = true;
                swiper1Ref.current?.slideNext(SLIDE_SPEED);
                swiper2Ref.current?.slideNext(SLIDE_SPEED);
                setTimeout(() => {
                    isSyncingRef.current = false;
                }, SLIDE_SPEED + 50);
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex, isPlaying, totalSlides]);

    if (isLoading) return <section className="gallery bg-[#F98D550F] py-7.5" />;
    if (images.length === 0 && imagesSub.length === 0) return null;

    // Handle manual dot navigation: jumps both sliders in unison
    const handleDotClick = (index: number) => {
        isSyncingRef.current = true;
        swiper1Ref.current?.slideToLoop(index, SLIDE_SPEED);
        swiper2Ref.current?.slideToLoop(index, SLIDE_SPEED);
        setActiveIndex(index);
        setProgress(0);
        setTimeout(() => {
            isSyncingRef.current = false;
        }, SLIDE_SPEED + 50);
    };

    // User swipe on slider 1 synchronizes slider 2
    const handleSlide1Change = (realIndex: number) => {
        setActiveIndex(realIndex);
        if (!isSyncingRef.current && swiper2Ref.current && !swiper2Ref.current.destroyed) {
            if (swiper2Ref.current.realIndex !== realIndex) {
                isSyncingRef.current = true;
                swiper2Ref.current.slideToLoop(realIndex, SLIDE_SPEED);
                setTimeout(() => {
                    isSyncingRef.current = false;
                }, SLIDE_SPEED + 50);
            }
        }
    };

    // User swipe on slider 2 synchronizes slider 1
    const handleSlide2Change = (realIndex: number) => {
        setActiveIndex(realIndex);
        if (!isSyncingRef.current && swiper1Ref.current && !swiper1Ref.current.destroyed) {
            if (swiper1Ref.current.realIndex !== realIndex) {
                isSyncingRef.current = true;
                swiper1Ref.current.slideToLoop(realIndex, SLIDE_SPEED);
                setTimeout(() => {
                    isSyncingRef.current = false;
                }, SLIDE_SPEED + 50);
            }
        }
    };

    const toggleAutoplay = () => {
        setIsPlaying((v) => {
            if (!v) setProgress(0);
            return !v;
        });
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
                    onSwiper={(s) => (swiper1Ref.current = s)}
                    onSlideChange={(s) => handleSlide1Change(s.realIndex)}
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={16}
                    loop={totalSlides > 1}
                    loopAdditionalSlides={3}
                    speed={SLIDE_SPEED}
                >
                    {normalizedMainImages.map((img, index) => (
                        <SwiperSlide key={`${img.publicId || "main"}-${index}`} className="w-[85%]! sm:w-[75%]! md:w-[60%]!">
                            <img src={img.url} alt="Gallery" className="block w-full h-auto object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="w-full h-3 sm:h-4 bg-white"></div>

                <Swiper
                    onSwiper={(s) => (swiper2Ref.current = s)}
                    onSlideChange={(s) => handleSlide2Change(s.realIndex)}
                    slidesPerView="auto"
                    spaceBetween={14}
                    loop={totalSlides > 1}
                    loopAdditionalSlides={5}
                    speed={SLIDE_SPEED}
                >
                    {normalizedSubImages.map((img, index) => (
                        <SwiperSlide key={`${img.publicId || "sub"}-${index}`} className="w-[55%]! sm:w-[38%]! md:w-[28%]! lg:w-[23%]!">
                            <div className="w-full">
                                <img src={img.url} alt="Gallery thumbnail" className="block w-full h-auto object-cover" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigator: progress dots + play/pause toggle */}
                <div className="relative mt-5 flex items-center justify-center px-4">
                    <div className="flex items-center gap-2 max-w-[70vw] overflow-x-auto py-1">
                        {normalizedSubImages.map((_, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    onClick={() => handleDotClick(index)}
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