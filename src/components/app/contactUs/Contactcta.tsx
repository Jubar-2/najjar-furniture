import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Container from "@/components/utils/Container";

interface ContactCTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ContactCTA({
  title = "Still have questions?",
  subtitle = "We're here to help",
  description = "Our team is available every day. Reach out by phone, email, or visit our showroom in person.",
  ctaLabel = "Chat With Us",
  ctaHref = "https://wa.me/8801XXXXXXXXX",
}: ContactCTAProps) {
  return (
    <section className="bg-[#fdf6ee] py-16">
      <Container>
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-[#2c160d] px-6 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#c9a06a] text-[#2c160d]">
            <MessageCircle className="size-5" />
          </span>

          <h2 className="text-2xl font-bold text-[#f2ead9] md:text-3xl">{title}</h2>
          <p className="text-lg font-semibold text-[#c9a06a]">{subtitle}</p>
          <p className="max-w-md text-[13px] leading-relaxed text-[#f2ead9]/70">{description}</p>

          <Link
            href={ctaHref}
            className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#c9a06a] px-6 py-3 text-[12px] font-semibold text-[#2c160d] transition-colors hover:bg-[#d9b27f]"
          >
            {ctaLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}