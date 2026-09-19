import Image, { StaticImageData } from "next/image";
import Container from "@/components/utils/Container";

interface AboutUsProps {
  imageSrc: string | StaticImageData;
  imageAlt?: string;
  title?: string;
  description?: string;
}

/*
    position: absolute;
    height: 549px;
    width: 100%;
    left: 0;
    top: -160px;
    right: 0;
    bottom: 0;
    color: transparent;
 */

export default function AboutUs({
  imageSrc,
  imageAlt = "Portrait of our craftsman",
  title = "About Us",
  description = "We create distinguished wooden furniture for those who appreciate refined living. Every piece is individually crafted from exceptional materials, balancing timeless form, authentic character, and meticulous craftsmanship—made not simply to furnish a space, but to define it. We create timeless wooden furniture that blends elegant design, lasting quality, and expert craftsmanship. Every piece is thoughtfully crafted to bring warmth, comfort, and character to your space.",
}: AboutUsProps) {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
          {/* Left — portrait on a rust-colored rounded backdrop */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="absolute inset-x-4 sm:inset-x-6 bottom-0 top-12 sm:top-16 rounded-3xl bg-linear-to-br from-[#c1571f] to-[#8a3f18]" />
            <div className="relative h-80 sm:h-95 md:h-100 w-full rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top text-transparent"
              />
            </div>
          </div>

          {/* Right — heading + copy */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#602100] tracking-tight">
              {title}
            </h2>
            <span className="mt-2.5 block h-0.75 w-14 bg-[#602100] mx-auto md:mx-0" />

            <p className="mt-5 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-[#2c160d]/85 font-normal mx-auto md:mx-0">
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}