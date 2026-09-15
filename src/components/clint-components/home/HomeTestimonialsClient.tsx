"use client";

import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
import profile from "@/assets/image/profile/jon.jpg";
import { useGetTestimonials } from "@/customHooks/useTestimonials";

/** Fallback static testimonials when the API returns no data yet */
const FALLBACK_TESTIMONIALS = [
    {
        id: "1",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "MD. Rashed Ahmed",
        location: "Khulna, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "2",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
    {
        id: "3",
        quote: "Najjar Furniture exceeded my expectations! The quality, finish, and attention to detail are truly outstanding. My living room has never looked better.",
        rating: 5,
        name: "Mrs. Fatema Khatun",
        location: "Dhaka, Bangladesh",
        avatarSrc: profile,
    },
];

export default function HomeTestimonialsClient() {
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
            : FALLBACK_TESTIMONIALS;

    return (
        <TestimonialsSlider
            testimonials={testimonials}
            isLoading={isLoading}
            title="Our Testimonials"
            description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
        />
    );
}
