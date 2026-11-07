"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Star, ExternalLink, CheckCircle2 } from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  rating: number; // 1-5
  name: string;
  location: string;
  avatarSrc: string | StaticImageData;
  source?: "manual" | "google";
  reviewUrl?: string;
  reviewTime?: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, rating, name, location, avatarSrc, source, reviewUrl, reviewTime } = testimonial;
  const isGoogle = source === "google";
  const [imageError, setImageError] = useState(false);

  // Format date if reviewTime is provided
  let formattedDate: string | null = null;
  if (reviewTime) {
    try {
      const d = new Date(reviewTime);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      formattedDate = null;
    }
  }

  // Fallback initial for avatar
  const initials = (name || "C")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="group relative flex flex-col justify-between h-full min-h-[300px] sm:min-h-[320px] rounded-2xl bg-white p-5 sm:p-6 md:p-7 border border-[#e8decb]/70 shadow-[0_4px_20px_-4px_rgba(65,23,0,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(65,23,0,0.12)] hover:-translate-y-1 transition-all duration-300">
      {/* Decorative Warm Quote Watermark in Background */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-5 text-4xl sm:text-5xl font-serif text-[#411700]/5 select-none transition-colors group-hover:text-[#411700]/10"
        style={{ fontFamily: "var(--font-cormorant-upright)" }}
      >
        &ldquo;&rdquo;
      </span>

      {/* Top Bar: Rating Stars & Verified Source Badge */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 sm:size-4.5 ${
                    i < rating
                      ? "fill-[#f5b731] text-[#f5b731]"
                      : "fill-neutral-200 text-neutral-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#411700]/90 ml-0.5">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Source Attribution Badge */}
          {isGoogle ? (
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs"
              title="Verified Google Business Review"
            >
              <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#602100] bg-[#fdf6ee] px-2.5 py-0.5 rounded-full border border-[#e8decb]/80"
              title="Verified Client Testimonial"
            >
              <CheckCircle2 className="size-3 text-[#602100]" />
              <span>Verified Client</span>
            </span>
          )}
        </div>

        {/* Review Quote Body */}
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#2b241f] line-clamp-5 relative z-1 font-normal">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Bottom Section: Reviewer Profile & External Link */}
      <div>
        <hr className="my-4 sm:my-5 border-[#e8decb]/60" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with fallback initials */}
            <div className="relative size-12 sm:size-13 shrink-0 overflow-hidden rounded-full ring-2 ring-[#e8decb]/60 ring-offset-2 ring-offset-white bg-[#fdf6ee] flex items-center justify-center">
              {avatarSrc && !imageError ? (
                <Image
                  src={avatarSrc}
                  alt={name}
                  fill
                  sizes="52px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={typeof avatarSrc === "string" && avatarSrc.startsWith("http")}
                />
              ) : (
                <span className="text-xs sm:text-sm font-bold text-[#411700]">
                  {initials}
                </span>
              )}
            </div>

            {/* Author info */}
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-[#1c1917] truncate">
                {name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#3a2c22]/70 truncate">
                <span className="truncate">{location}</span>
                {formattedDate && (
                  <>
                    <span className="text-[#3a2c22]/30">•</span>
                    <span className="shrink-0 text-[11px] text-[#3a2c22]/60">
                      {formattedDate}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* View on Google link */}
          {isGoogle && reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#411700] hover:text-[#8b4513] transition-colors bg-[#fdf6ee] hover:bg-[#f5e9d9] px-2.5 py-1 rounded-full border border-[#e8decb] shrink-0 active:scale-95"
              title="View on Google Maps"
            >
              <span>View</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
