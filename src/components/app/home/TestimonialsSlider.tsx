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
}: TestimonialsSliderProps) {
  return (
    <section className="bg-[#fdf6ee] py-16">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#411700] md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[#3a2c22]/70">
            {description}
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true, el: ".testimonials-pagination" }}
          className="mt-10 pb-10!"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="h-auto pb-1">
              <TestimonialCard testimonial={t} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="testimonials-pagination
         flex items-center 
         justify-center 
         gap-1.5 
         [&_.swiper-pagination-bullet]:h-1.5 
         [&_.swiper-pagination-bullet]:w-1.5 
         [&_.swiper-pagination-bullet]:rounded-full 
         [&_.swiper-pagination-bullet]:bg-neutral-300 
         [&_.swiper-pagination-bullet]:opacity-100 
         [&_.swiper-pagination-bullet]:transition-all 
         [&_.swiper-pagination-bullet-active]:w-4 
         [&_.swiper-pagination-bullet-active]:bg-[#411700]!"
        />
      </Container>
    </section>
  );
}