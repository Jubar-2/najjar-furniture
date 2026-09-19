import { Hammer, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import Container from "@/components/utils/Container";

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DEFAULT_VALUES: Value[] = [
  {
    icon: <Hammer className="size-6" />,
    title: "Expert Craftsmanship",
    description: "Every piece is individually handcrafted by skilled artisans with decades of experience.",
  },
  {
    icon: <Leaf className="size-6" />,
    title: "Sustainable Materials",
    description: "We source responsibly harvested wood, honoring the natural material we work with.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    title: "Built to Last",
    description: "Timeless construction techniques mean our furniture is made for generations, not seasons.",
  },
  {
    icon: <HeartHandshake className="size-6" />,
    title: "Client Devotion",
    description: "From first sketch to final delivery, we treat every client's space as our own.",
  },
];

interface OurValuesProps {
  title?: string;
  description?: string;
  values?: Value[];
}

export default function OurValues({
  title = "What We Stand For",
  description = "The principles that guide every piece we make.",
  values = DEFAULT_VALUES,
}: OurValuesProps) {
  return (
    <section className="bg-[#fdf6ee] py-12 sm:py-16 md:py-20">
      <Container>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6b3f22] tracking-tight">{title}</h2>
          <p className="mx-auto mt-2 sm:mt-3 max-w-md text-xs sm:text-[13.5px] leading-relaxed text-[#3a2c22]/75">
            {description}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center rounded-2xl bg-white p-5 sm:p-7 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-md"
            >
              <span className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-[#f2ead9] text-[#6b3f22]">
                {value.icon}
              </span>
              <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-semibold text-[#2b1810]">{value.title}</h3>
              <p className="mt-2 text-xs sm:text-[12.5px] leading-relaxed text-[#3a2c22]/75">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}