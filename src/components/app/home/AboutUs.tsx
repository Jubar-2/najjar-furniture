import Image from "next/image";
import Container from "@/components/utils/Container";

interface AboutUsProps {
  imageSrc: string;
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
    <section className="bg-white py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Left — portrait on a rust-colored rounded backdrop */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-6 bottom-0 top-16 rounded-3xl bg-linear-to-br from-[#c1571f] to-[#8a3f18]" />
            <div className="relative h-95 w-full rounded-3xl">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top -top-40! h-137.25! w-full! left-0! right-0! bottom-0! text-transparent"
              />
            </div>
          </div>

          {/* Right — heading + copy */}
          <div>
            <h2 className="text-[50px] font-bold text-[#602100] md:text-4xl">{title}</h2>
            <span className="mt-2 block h-0.75 w-14 bg-[#602100]" />

            <p className="mt-6 max-w-lg text-[14px] font-medium leading-relaxed text-[#000000]">
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}