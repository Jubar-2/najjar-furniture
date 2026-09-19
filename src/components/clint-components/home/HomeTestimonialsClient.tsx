"use client";

import TestimonialsSlider from "@/components/app/home/TestimonialsSlider";
import profile from "@/assets/image/profile/jon.jpg";
import { useGetTestimonials } from "@/customHooks/useTestimonials";

export default function HomeTestimonialsClient() {
    const { data, isLoading } = useGetTestimonials();

    if (isLoading) {
        return (
            <TestimonialsSlider
                testimonials={[]}
                isLoading={true}
                title="Our Testimonials"
                description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
            />
        );
    }

    if (!data || data.length === 0) {
        return null;
    }

    const testimonials = data.map((t) => ({
        id: t._id,
        quote: t.message,
        rating: 5,
        name: t.name,
        location: t.location,
        avatarSrc: t.avatar || profile,
    }));

    return (
        <TestimonialsSlider
            testimonials={testimonials}
            isLoading={isLoading}
            title="Our Testimonials"
            description="We take pride in delivering furniture that not only looks beautiful but also brings comfort and lasting value to our clients."
        />
    );
}
