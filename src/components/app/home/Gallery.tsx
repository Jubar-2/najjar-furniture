"use client";

import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pause, Play } from "lucide-react";

import type { GalleryImage } from "@/customHooks/getGallery";
import { optimizeCloudinaryUrl, getCloudinarySrcSet } from "@/lib/images";

import "swiper/css";

const AUTOPLAY_DELAY = 3000;
const SLIDE_SPEED = 1200;

interface GalleryProps {
    isLoading?: boolean;
    images?: GalleryImage[];
    imagesSub?: GalleryImage[];
}

const Gallery = memo(function Gallery({ isLoading, images = [], imagesSub = [] }: GalleryProps) {
    const swiper1Ref = useRef<SwiperType | null>(null);
    const swiper2Ref = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

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

    // Advance sliders simultaneously when autoplay delay elapses.
    // Progress fill is handled entirely by GPU-accelerated CSS keyframe animation,
    // eliminating 60fps requestAnimationFrame React re-renders.
    useEffect(() => {
        if (!isPlaying || totalSlides <= 1) return;

        const timer = setTimeout(() => {
            isSyncingRef.current = true;
            swiper1Ref.current?.slideNext(SLIDE_SPEED);
            swiper2Ref.current?.slideNext(SLIDE_SPEED);
            setTimeout(() => {
                isSyncingRef.current = false;
            }, SLIDE_SPEED + 50);
        }, AUTOPLAY_DELAY);

        return () => clearTimeout(timer);
    }, [activeIndex, isPlaying, totalSlides]);

    // Handle manual dot navigation: jumps both sliders in unison
    const handleDotClick = useCallback((index: number) => {
        isSyncingRef.current = true;
        swiper1Ref.current?.slideToLoop(index, SLIDE_SPEED);
        swiper2Ref.current?.slideToLoop(index, SLIDE_SPEED);
        setActiveIndex(index);
        setTimeout(() => {
            isSyncingRef.current = false;
        }, SLIDE_SPEED + 50);
    }, []);

    // User swipe on slider 1 synchronizes slider 2
    const handleSlide1Change = useCallback((realIndex: number) => {
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
    }, []);

    // User swipe on slider 2 synchronizes slider 1
    const handleSlide2Change = useCallback((realIndex: number) => {
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
    }, []);

    const toggleAutoplay = useCallback(() => {
        setIsPlaying((v) => !v);
    }, []);

    if (isLoading) return <section className="gallery bg-[#F98D550F] py-7.5" />;
    if (images.length === 0 && imagesSub.length === 0) return null;

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
                            <img
                                src={optimizeCloudinaryUrl(img.url, { width: 800 })}
                                srcSet={getCloudinarySrcSet(img.url, [480, 640, 800, 1024])}
                                sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 800px"
                                alt="Gallery piece"
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                                width={800}
                                height={426}
                                className="block w-full h-auto object-cover"
                            />
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
                                <img
                                    src={optimizeCloudinaryUrl(img.url, { width: 320 })}
                                    srcSet={getCloudinarySrcSet(img.url, [240, 320, 480])}
                                    sizes="(max-width: 640px) 55vw, (max-width: 768px) 38vw, (max-width: 1024px) 28vw, 320px"
                                    alt="Gallery thumbnail"
                                    loading="lazy"
                                    decoding="async"
                                    width={320}
                                    height={170}
                                    className="block w-full h-auto object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigator: progress dots + play/pause toggle */}
                <div className="relative mt-5 flex items-center justify-center px-4">
                    <div className="flex items-center gap-0.5 sm:gap-1 max-w-[70vw] overflow-x-auto py-1">
                        {normalizedSubImages.map((_, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    onClick={() => handleDotClick(index)}
                                    className="group relative flex min-h-6 min-w-6 items-center justify-center p-1.5 shrink-0 cursor-pointer touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-full"
                                >
                                    <span
                                        className={`relative block shrink-0 overflow-hidden rounded-full bg-neutral-300 transition-all duration-300 ${isActive ? "h-1.5 w-7 sm:w-8" : "h-1.5 w-1.5"
                                            }`}
                                    >
                                        {isActive && (
                                            <span
                                                key={`progress-${activeIndex}`}
                                                className="absolute inset-y-0 left-0 rounded-full bg-neutral-800"
                                                style={{
                                                    animation: isPlaying ? `galleryDotProgress ${AUTOPLAY_DELAY}ms linear forwards` : "none",
                                                    animationPlayState: isPlaying ? "running" : "paused",
                                                    width: isPlaying ? undefined : "0%",
                                                }}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="ml-3 sm:ml-4">
                        <button
                            type="button"
                            onClick={toggleAutoplay}
                            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                            className="flex size-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-300 shadow-xs cursor-pointer"
                        >
                            {isPlaying ? (
                                <Pause className="size-3.5" fill="currentColor" />
                            ) : (
                                <Play className="size-3.5" fill="currentColor" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default Gallery;