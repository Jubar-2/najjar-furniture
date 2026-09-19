"use client";

import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
import profile from "@/assets/image/profile/jon.jpg";
import { useGetTestimonials } from "@/customHooks/useTestimonials";

const DEFAULT_TESTIMONIALS = [
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

export default function AboutTestimonialsClient() {
  const { data, isLoading } = useGetTestimonials();

  const testimonials =
    data && data.length > 0
      ? data.map((t) => ({
          id: t._id,
          quote: t.message,
          rating: 5,
          name: t.name,
          location: t.location,
          avatarSrc: t.avatar || profile,
        }))
      : DEFAULT_TESTIMONIALS;

  return (
    <TestimonialsSlider
      testimonials={testimonials}
      isLoading={isLoading}
      title="Our Testimonials"
      description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
    />
  );
}
