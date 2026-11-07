"use client";

import Image, { StaticImageData } from "next/image";
import { Star, ExternalLink } from "lucide-react";

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

  // Format date if reviewTime is present
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

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-[0px_4px_14.9px_0px_#00000030] min-h-70 sm:min-h-77.5 h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif text-3xl sm:text-4xl leading-none text-[#FFEADF4A]">
            <svg
              width="28"
              height="25"
              viewBox="0 0 34 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-8 sm:h-7"
            >
              <path
                d="M19.712 29.8237V19.8397C19.712 14.3784 20.7786 9.89839 22.912 6.39972C25.1306 2.90106 28.672 0.767726 33.536 -0.000274658V5.24772C30.6346 5.58905 28.5866 6.69839 27.392 8.57572C26.1973 10.4531 25.6 13.4397 25.6 17.5357L21.76 17.0237H33.408V29.8237H19.712ZM-2.67029e-05 29.8237V19.8397C-2.67029e-05 14.3784 1.06664 9.89839 3.19997 6.39972C5.41864 2.90106 8.95997 0.767726 13.824 -0.000274658V5.24772C10.9226 5.58905 8.87464 6.69839 7.67997 8.57572C6.48531 10.4531 5.88797 13.4397 5.88797 17.5357L2.04797 17.0237H13.696V29.8237H-2.67029e-05Z"
                fill="#381604"
              />
            </svg>
          </span>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 sm:size-4.5 ${
                    i < rating ? "fill-[#f5b731] text-[#f5b731]" : "fill-neutral-200 text-neutral-200"
                  }`}
                />
              ))}
            </div>

            {isGoogle && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60"
                title="Verified Google Review"
              >
                <svg className="size-3 shrink-0" viewBox="0 0 24 24">
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
                Google
              </span>
            )}
          </div>
        </div>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[#2b241f] line-clamp-5">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div>
        <hr className="my-4 border-neutral-200" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
              <Image
                src={avatarSrc}
                alt={name}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized={typeof avatarSrc === "string" && avatarSrc.startsWith("http")}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-[#000000] truncate">{name}</p>
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#3a2c22]/80">
                <span className="truncate">{location}</span>
                {formattedDate && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className="shrink-0 text-neutral-500 text-[11px]">{formattedDate}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {isGoogle && reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline shrink-0 p-1 font-medium transition-colors"
              title="View on Google"
            >
              <span>View</span>
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
