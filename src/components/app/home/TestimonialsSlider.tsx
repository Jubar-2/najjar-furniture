"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Container from "@/components/utils/Container";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

import "swiper/css";
import "swiper/css/pagination";

interface TestimonialsSliderProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  testimonials: Testimonial[];
}

export default function TestimonialsSlider({
  title = "Our Testimonials",
  description = "We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients.",
  testimonials,
  isLoading = false,
}: TestimonialsSliderProps) {
  return (
    <section className="bg-[#fdf6ee] py-12 sm:py-16">
      <Container>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#411700] tracking-tight">{title}</h2>
          <p className="mx-auto mt-2 sm:mt-3 max-w-md text-xs sm:text-[13.5px] leading-relaxed text-[#3a2c22]/75">
            {description}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-[0px_4px_14.9px_0px_#00000015] min-h-70 sm:min-h-77.5 h-full justify-between animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-7 bg-[#381604]/10 rounded" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, s) => (
                        <div key={s} className="size-4 bg-amber-100 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    <div className="h-3.5 bg-neutral-200 rounded w-full" />
                    <div className="h-3.5 bg-neutral-200 rounded w-5/6" />
                    <div className="h-3.5 bg-neutral-200 rounded w-4/6" />
                  </div>
                </div>
                <div>
                  <hr className="my-4 border-neutral-100" />
                  <div className="flex items-center gap-3">
                    <div className="size-12 sm:size-14 rounded-full bg-neutral-200 shrink-0" />
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
          <>
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              pagination={{ clickable: true, el: ".testimonials-pagination" }}
              className="mt-8 sm:mt-10 pb-10!"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id} className="h-auto pb-2 flex">
                  <TestimonialCard testimonial={t} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              className="testimonials-pagination
             flex items-center 
             justify-center 
             gap-1.5 
             [&_.swiper-pagination-bullet]:relative
             [&_.swiper-pagination-bullet]:before:content-['']
             [&_.swiper-pagination-bullet]:before:absolute
             [&_.swiper-pagination-bullet]:before:-inset-2.5
             [&_.swiper-pagination-bullet]:cursor-pointer
             [&_.swiper-pagination-bullet]:h-1.5 
             [&_.swiper-pagination-bullet]:w-1.5 
             [&_.swiper-pagination-bullet]:rounded-full 
             [&_.swiper-pagination-bullet]:bg-neutral-300 
             [&_.swiper-pagination-bullet]:opacity-100 
             [&_.swiper-pagination-bullet]:transition-all"
            />
          </>
        )}
      </Container>
    </section>
  );
}