"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Container from "@/components/utils/Container";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface TestimonialsSliderProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  testimonials: Testimonial[];
}

function TestimonialsSlider({
  title = "Our Testimonials",
  description = "We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients.",
  testimonials,
  isLoading = false,
}: TestimonialsSliderProps) {
  return (
    <section className="relative bg-[#fdf6ee] py-14 sm:py-18 md:py-20 overflow-hidden">
      {/* Subtle Warm Decorative Ambience Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#f8efe3]/80 to-transparent"
      />

      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#411700]/6 border border-[#411700]/12 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#411700] mb-3">
            <Star className="size-3 fill-[#f5b731] text-[#f5b731]" />
            <span>Client Feedback & Reviews</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold text-[#411700] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-cormorant-upright)" }}
          >
            {title}
          </h2>

          <span className="mt-2.5 sm:mt-3 block h-0.75 w-16 bg-[#411700] mx-auto rounded-full" />

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#3a2c22]/80">
            {description}
          </p>
        </div>

        {/* Content Section: Skeleton Loading or Swiper Slider */}
        {isLoading ? (
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between h-full min-h-75 sm:min-h-80 rounded-2xl bg-white p-6 sm:p-7 border border-[#e8decb]/60 shadow-[0_4px_20px_-4px_rgba(65,23,0,0.06)] animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, s) => (
                        <div
                          key={s}
                          className="size-4 bg-amber-100/80 rounded-full"
                        />
                      ))}
                    </div>
                    <div className="h-5 w-16 bg-neutral-100 rounded-full" />
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <div className="h-3.5 bg-neutral-200 rounded w-full" />
                    <div className="h-3.5 bg-neutral-200 rounded w-5/6" />
                    <div className="h-3.5 bg-neutral-200 rounded w-4/6" />
                  </div>
                </div>

                <div>
                  <hr className="my-4 border-[#e8decb]/50" />
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-neutral-200 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-28" />
                      <div className="h-3 bg-neutral-100 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mt-10 sm:mt-12">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              slidesPerView={1}
              spaceBetween={16}
              grabCursor={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              navigation={{
                prevEl: ".testimonials-prev",
                nextEl: ".testimonials-next",
              }}
              pagination={{
                clickable: true,
                el: ".testimonials-pagination",
              }}
              className="pb-4"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id} className="h-auto pb-2 flex">
                  <TestimonialCard testimonial={t} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Slider Controls Bar: Navigation Arrows + Pagination Bullets */}
            <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
              {/* Previous Button */}
              <button
                type="button"
                className="testimonials-prev flex size-9 sm:size-10 items-center justify-center rounded-full border border-[#411700]/20 bg-white text-[#411700] shadow-2xs transition-all duration-200 hover:bg-[#411700] hover:text-white hover:border-[#411700] hover:shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#411700]/40 shrink-0"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>

              {/* Dynamic Expandable Pagination Bullets */}
              <div
                className="testimonials-pagination
                  flex items-center 
                  justify-center 
                  gap-1.5 
                  [&_.swiper-pagination-bullet]:cursor-pointer
                  [&_.swiper-pagination-bullet]:h-2 
                  [&_.swiper-pagination-bullet]:rounded-full 
                  [&_.swiper-pagination-bullet]:opacity-100 
                  [&_.swiper-pagination-bullet]:transition-all
                  [&_.swiper-pagination-bullet]:duration-300
                  [&_.swiper-pagination-bullet-active]:w-7
                  [&_.swiper-pagination-bullet-active]:bg-[#262626]"
              />

              {/* Next Button */}
              <button
                type="button"
                className="testimonials-next flex size-9 sm:size-10 items-center justify-center rounded-full border border-[#411700]/20 bg-white text-[#411700] shadow-2xs transition-all duration-200 hover:bg-[#411700] hover:text-white hover:border-[#411700] hover:shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#411700]/40 shrink-0"
                aria-label="Next testimonial"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

export default memo(TestimonialsSlider);
