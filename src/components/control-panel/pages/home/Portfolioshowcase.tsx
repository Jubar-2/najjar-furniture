import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Sofa, Users, Hammer, Star, ArrowRight } from "lucide-react";
import Container from "@/components/utils/Container";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface PortfolioImage {
  src: string | StaticImageData;
  alt: string;
  href: string;
  width?: string | number;
}

interface PortfolioShowcaseProps {
  title?: string;
  description?: string;
  stats?: Stat[];
  ctaLabel?: string;
  ctaHref?: string;
  images: PortfolioImage[];
}

const DEFAULT_STATS: Stat[] = [
  {
    icon: <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10C4 5.58125 7.58125 2 12 2H28C32.4188 2 36 5.58125 36 10V12.1C33.7188 12.5625 32 14.5813 32 17V20H8V17C8 14.5813 6.28125 12.5625 4 12.1V10ZM34 17C34 15.6938 34.8375 14.5813 36 14.1687C36.3125 14.0562 36.65 14 37 14C38.6562 14 40 15.3438 40 17V28C40 29.1063 39.1063 30 38 30H36C34.8937 30 34 29.1063 34 28H6C6 29.1063 5.10625 30 4 30H2C0.89375 30 0 29.1063 0 28V17C0 15.3438 1.34375 14 3 14C3.35 14 3.6875 14.0625 4 14.1687C5.1625 14.5813 6 15.6938 6 17V22H34V17Z" fill="#462514" />
    </svg>,
    value: "150+",
    label: "Project Completed"
  },
  {
    icon: <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.3 14.875C8.61656 14.875 10.5 12.9691 10.5 10.625C10.5 8.28086 8.61656 6.375 6.3 6.375C3.98344 6.375 2.1 8.28086 2.1 10.625C2.1 12.9691 3.98344 14.875 6.3 14.875ZM35.7 14.875C38.0166 14.875 39.9 12.9691 39.9 10.625C39.9 8.28086 38.0166 6.375 35.7 6.375C33.3834 6.375 31.5 8.28086 31.5 10.625C31.5 12.9691 33.3834 14.875 35.7 14.875ZM37.8 17H33.6C32.445 17 31.4016 17.4715 30.6403 18.2352C33.285 19.7027 35.1619 22.3523 35.5687 25.5H39.9C41.0616 25.5 42 24.5504 42 23.375V21.25C42 18.9059 40.1166 17 37.8 17ZM21 17C25.0622 17 28.35 13.673 28.35 9.5625C28.35 5.45195 25.0622 2.125 21 2.125C16.9378 2.125 13.65 5.45195 13.65 9.5625C13.65 13.673 16.9378 17 21 17ZM26.04 19.125H25.4953C24.1303 19.7891 22.6144 20.1875 21 20.1875C19.3856 20.1875 17.8762 19.7891 16.5047 19.125H15.96C11.7862 19.125 8.4 22.5516 8.4 26.775V28.6875C8.4 30.4473 9.81094 31.875 11.55 31.875H30.45C32.1891 31.875 33.6 30.4473 33.6 28.6875V26.775C33.6 22.5516 30.2137 19.125 26.04 19.125ZM11.3597 18.2352C10.5984 17.4715 9.555 17 8.4 17H4.2C1.88344 17 0 18.9059 0 21.25V23.375C0 24.5504 0.938437 25.5 2.1 25.5H6.42469C6.83812 22.3523 8.715 19.7027 11.3597 18.2352Z" fill="#462514" />
    </svg>,
    value: "120+",
    label: "Happy Clients"
  },
  {
    icon:
      <svg width="39" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_54_220)">
          <path d="M8.75 19.6875C8.75 18.8222 8.49341 17.9763 8.01268 17.2569C7.53195 16.5374 6.84867 15.9767 6.04924 15.6455C5.24981 15.3144 4.37015 15.2278 3.52148 15.3966C2.67282 15.5654 1.89326 15.9821 1.28141 16.5939C0.669555 17.2058 0.252877 17.9853 0.0840664 18.834C-0.084744 19.6826 0.0018956 20.5623 0.333029 21.3617C0.664162 22.1612 1.22492 22.8445 1.94438 23.3252C2.66385 23.8059 3.50971 24.0625 4.375 24.0625V35H30.625V24.0625C31.4903 24.0625 32.3362 23.8059 33.0556 23.3252C33.7751 22.8445 34.3358 22.1612 34.667 21.3617C34.9981 20.5623 35.0847 19.6826 34.9159 18.834C34.7471 17.9853 34.3304 17.2058 33.7186 16.5939C33.1067 15.9821 32.3272 15.5654 31.4785 15.3966C30.6299 15.2278 29.7502 15.3144 28.9508 15.6455C28.1513 15.9767 27.4681 16.5374 26.9873 17.2569C26.5066 17.9763 26.25 18.8222 26.25 19.6875V24.0625H8.75V19.6875Z" fill="#462514" />
          <path d="M12.0312 19.6875C12.0312 17.6645 11.2306 15.7237 9.80423 14.2892C8.37785 12.8546 6.44167 12.0429 4.4187 12.0313C4.68756 8.74667 6.18226 5.68339 8.6058 3.45013C11.0293 1.21686 14.2043 -0.0229492 17.5 -0.0229492C20.7956 -0.0229492 23.9706 1.21686 26.3941 3.45013C28.8176 5.68339 30.3123 8.74667 30.5812 12.0313C28.5582 12.0429 26.6221 12.8546 25.1957 14.2892C23.7693 15.7237 22.9687 17.6645 22.9687 19.6875V20.7813H12.0312V19.6875Z" fill="#462514" />
        </g>
        <defs>
          <clipPath id="clip0_54_220">
            <rect width="35" height="35" fill="white" />
          </clipPath>
        </defs>
      </svg>,
    value: "10+",
    label: "Years Experience"
  },
  {
    icon: <svg width="39" height="36" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.5859 13.448L24.9159 12.0426L20.5931 3.27902C20.475 3.03908 20.2808 2.84484 20.0409 2.72677C19.4391 2.4297 18.7078 2.67726 18.407 3.27902L14.0842 12.0426L4.41419 13.448C4.14759 13.486 3.90384 13.6117 3.71722 13.8022C3.49161 14.0341 3.36728 14.346 3.37157 14.6695C3.37585 14.993 3.5084 15.3016 3.74007 15.5275L10.7365 22.3486L9.08353 31.9806C9.04477 32.2046 9.06956 32.4351 9.1551 32.6458C9.24064 32.8565 9.3835 33.039 9.56748 33.1726C9.75146 33.3062 9.96921 33.3856 10.196 33.4018C10.4228 33.4179 10.6496 33.3702 10.8507 33.2641L19.5 28.7166L28.1493 33.2641C28.3855 33.3898 28.6597 33.4317 28.9225 33.386C29.5852 33.2717 30.0308 32.6433 29.9165 31.9806L28.2636 22.3486L35.26 15.5275C35.4504 15.3408 35.5761 15.0971 35.6142 14.8305C35.717 14.164 35.2524 13.547 34.5859 13.448Z" fill="#462514" />
    </svg>,
    value: "100%",
    label: "Quality Commitment"
  },
];

export default function PortfolioShowcase({
  title = "Our Portfolio",
  description = "Every piece is thoughtfully designed and expertly handcrafted to combine natural beauty, lasting durability,and refined elegance—creating furniture that belongs in your space for generations.",
  stats = DEFAULT_STATS,
  ctaLabel = "View All Portfolio",
  ctaHref = "/portfolio",
  images,
}: PortfolioShowcaseProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-14">
          {/* Left column */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#602100] tracking-tight">{title}</h2>
            <span className="mt-2 block h-0.75 w-14 bg-[#602100]" />

            <div
              className="mt-4 sm:mt-5 max-w-md text-sm sm:text-base md:text-lg leading-relaxed text-black/85 font-normal [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="relative z-10 flex flex-col items-start gap-1 p-2">
                  <div className="absolute left-0.5 -top-px -z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#FDF0B4]"></div>
                  <div className="text-[#6b3f22]">{stat.icon}</div>
                  <span className="mt-2 block text-base sm:text-lg md:text-xl font-bold text-[#381604]">
                    {stat.value}
                  </span>
                  <span className="block text-[10px] sm:text-xs text-[#000000]/80">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2.5 bg-[#e9c9a0] px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-[#462514] transition-all hover:bg-[#dfb987] hover:shadow-md"
            >
              {ctaLabel.toUpperCase()}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Right column — 2x2 image grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3.1] overflow-hidden rounded-xl sm:rounded-2xl shadow-[0px_4px_20px_0px_#00000040]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <Link
                  href={image.href}
                  className="absolute bottom-2 sm:bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#f2ead9]/95 px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-[#3a2c22] shadow-sm transition-colors hover:bg-white whitespace-nowrap"
                >
                  About
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}