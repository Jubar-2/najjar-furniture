"use client";

import { useMemo } from "react";
import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
import { type Testimonial } from "@/components/app/home/TestimonialCard";
import profile from "@/assets/image/profile/jon.jpg";
import { useGetTestimonials } from "@/customHooks/useTestimonials";
import { useGetGoogleReviews } from "@/customHooks/useGoogleReviews";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default_1",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
    rating: 5,
    name: "MD. Rashed Ahmed",
    location: "Khulna, Bangladesh",
    avatarSrc: "/images/avatars/rashed-ahmed.jpg",
    source: "manual",
  },
  {
    id: "default_2",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding.",
    rating: 5,
    name: "Mrs. Fatema Khatun",
    location: "Dhaka, Bangladesh",
    avatarSrc: "/images/avatars/fatema-khatun-1.jpg",
    source: "manual",
  },
  {
    id: "default_3",
    quote:
      "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
    rating: 5,
    name: "Mrs. Fatema Khatun",
    location: "Dhaka, Bangladesh",
    avatarSrc: "/images/avatars/fatema-khatun-2.jpg",
    source: "manual",
  },
];

export default function AboutTestimonialsClient() {
  const { data: manualData, isLoading: isManualLoading } = useGetTestimonials();
  const { data: googleData, isLoading: isGoogleLoading } = useGetGoogleReviews();

  const testimonials = useMemo<Testimonial[]>(() => {
    const list: Testimonial[] = [];
    const seenIds = new Set<string>();

    // 1. Process manual testimonials from MongoDB
    if (Array.isArray(manualData)) {
      for (const t of manualData) {
        const id = `manual_${t._id}`;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          list.push({
            id,
            quote: t.message,
            rating: 5,
            name: t.name || "Client",
            location: t.location || "Client Testimonial",
            avatarSrc: t.avatar || profile,
            source: "manual",
          });
        }
      }
    }

    // 2. Process Google Reviews from SerpApi
    if (Array.isArray(googleData)) {
      for (const g of googleData) {
        const id = `google_${g.reviewId}`;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          list.push({
            id,
            quote: g.comment,
            rating: g.rating,
            name: g.reviewerName,
            location: "Google Review",
            avatarSrc: g.reviewerAvatarUrl || profile,
            source: "google",
            reviewUrl: g.reviewUrl,
            reviewTime: g.reviewTime,
          });
        }
      }
    }

    return list.length > 0 ? list : DEFAULT_TESTIMONIALS;
  }, [manualData, googleData]);

  const isLoading = (isManualLoading || isGoogleLoading) && (!manualData && !googleData);

  return (
    <TestimonialsSlider
      testimonials={testimonials}
      isLoading={isLoading}
      title="Our Testimonials"
      description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
    />
  );
}
