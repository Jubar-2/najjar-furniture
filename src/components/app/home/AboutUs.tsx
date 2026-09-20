import Image, { StaticImageData } from "next/image";
import Container from "@/components/utils/Container";
import { optimizeCloudinaryUrl } from "@/lib/images";

interface AboutUsProps {
  imageSrc: string | StaticImageData;
  imageAlt?: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const DEFAULT_DESCRIPTION =
  "We create distinguished wooden furniture for those who appreciate refined living. Every piece is individually crafted from exceptional materials, balancing timeless form, authentic character, and meticulous craftsmanship—made not simply to furnish a space, but to define it. We create timeless wooden furniture that blends elegant design, lasting quality, and expert craftsmanship. Every piece is thoughtfully crafted to bring warmth, comfort, and character to your space.";

export default function AboutUs({
  imageSrc,
  imageAlt = "Portrait of our craftsman",
  title = "About Us",
  description,
  isLoading = false,
}: AboutUsProps) {
  const contentDescription = description?.trim() ? description : DEFAULT_DESCRIPTION;
  const isHtml = /<[a-z][\s\S]*>/i.test(contentDescription);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
          {/* Left — portrait */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm h-85 sm:h-100 md:h-110 rounded-3xl overflow-hidden shadow-lg bg-neutral-100">
            {isLoading ? (
              <div className="w-full h-full bg-neutral-200 animate-pulse" />
            ) : (
              <Image
                src={typeof imageSrc === "string" ? optimizeCloudinaryUrl(imageSrc, { width: 600 }) : imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 640px) 320px, 384px"
                className="object-cover object-top text-transparent"
              />
            )}
          </div>

          {/* Right — heading + copy */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#602100] tracking-tight">
              {title}
            </h2>
            <span className="mt-2.5 block h-0.75 w-14 bg-[#602100] mx-auto md:mx-0" />

            {isLoading ? (
              <div className="mt-5 sm:mt-6 max-w-lg space-y-3 mx-auto md:mx-0">
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-4/6" />
              </div>
            ) : isHtml ? (
              <div
                className="mt-5 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-[#2c160d]/85 font-normal mx-auto md:mx-0 prose prose-neutral max-w-none prose-p:my-2"
                dangerouslySetInnerHTML={{ __html: contentDescription }}
              />
            ) : (
              <p className="mt-5 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-[#2c160d]/85 font-normal mx-auto md:mx-0 whitespace-pre-line">
                {contentDescription}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}