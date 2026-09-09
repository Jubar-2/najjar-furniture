import { Sofa, Ruler, Boxes, Truck, ShieldCheck, MapPin } from "lucide-react";
import Container from "@/components/utils/Container";

interface HelpCategory {
  icon: React.ReactNode;
  label: string;
}

const CATEGORIES: HelpCategory[] = [
  { icon: <Sofa className="size-4" />, label: "General Inquiry" },
  { icon: <Ruler className="size-4" />, label: "Custom Order" },
  { icon: <Boxes className="size-4" />, label: "Bulk / Wholesale" },
  { icon: <Truck className="size-4" />, label: "Delivery & Shipping" },
  { icon: <ShieldCheck className="size-4" />, label: "Warranty & Repair" },
  { icon: <MapPin className="size-4" />, label: "Showroom Visit" },
];

export default function ContactHelpCategories() {
  return (
    <section className="bg-[#fdf6ee] pb-4 pt-12">
      <Container>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#2b1810] md:text-xl">
            What do you need help with?
          </h2>
          <p className="mt-1.5 text-[12.5px] text-[#3a2c22]/60">
            Tap a topic to jump straight to the right section, or just send us a message below.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#e5ded3] bg-white px-4 py-2 text-[12px] font-medium text-[#3a2c22] shadow-sm transition-colors hover:border-[#c9a06a] hover:text-[#6b3f22]"
            >
              <span className="text-[#c9a06a]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}