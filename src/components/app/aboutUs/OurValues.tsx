import { Hammer, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import Container from "@/components/app/Header";

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
    <section className="bg-[#fdf6ee] py-16">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#6b3f22] md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[#3a2c22]/70">
            {description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-[#f2ead9] text-[#6b3f22]">
                {value.icon}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-[#2b1810]">{value.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-[#3a2c22]/70">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}