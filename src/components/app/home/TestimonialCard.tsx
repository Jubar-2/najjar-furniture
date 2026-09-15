"use client";

import Image, { StaticImageData } from "next/image";
import { Star } from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  rating: number; // 1-5
  name: string;
  location: string;
  avatarSrc: string | StaticImageData;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, rating, name, location, avatarSrc } = testimonial;

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-[0px_4px_14.9px_0px_#00000040] h-80.75">
      <div className="flex items-center justify-between mb-5">
        <span className="font-serif text-4xl leading-none text-[#FFEADF4A]">
          <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.712 29.8237V19.8397C19.712 14.3784 20.7786 9.89839 22.912 6.39972C25.1306 2.90106 28.672 0.767726 33.536 -0.000274658V5.24772C30.6346 5.58905 28.5866 6.69839 27.392 8.57572C26.1973 10.4531 25.6 13.4397 25.6 17.5357L21.76 17.0237H33.408V29.8237H19.712ZM-2.67029e-05 29.8237V19.8397C-2.67029e-05 14.3784 1.06664 9.89839 3.19997 6.39972C5.41864 2.90106 8.95997 0.767726 13.824 -0.000274658V5.24772C10.9226 5.58905 8.87464 6.69839 7.67997 8.57572C6.48531 10.4531 5.88797 13.4397 5.88797 17.5357L2.04797 17.0237H13.696V29.8237H-2.67029e-05Z" fill="#381604" />
          </svg>
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              width={24}
              height={26}
              key={i}
              className={`${i < rating ? "fill-[#f5b731] text-[#f5b731]" : "fill-neutral-200 text-neutral-200"
                }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 flex-1 text-base leading-relaxed text-[#000000]">
        &ldquo;{quote}&rdquo;
      </p>

      <hr className="my-4 border-neutral-200" />

      <div className="flex items-center gap-3">
        <div className="relative size-15 shrink-0 overflow-hidden rounded-full">
          <Image src={avatarSrc} alt={name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-[#000000]">{name}</p>
          <p className="text-[13px] text-[#3a2c22]/60">{location}</p>
        </div>
      </div>
    </div>
  );
}