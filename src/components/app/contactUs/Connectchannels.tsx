import Link from "next/link";
import { Phone, Mail } from "lucide-react"; //Facebook, Instagram, Youtube, Linkedin
import Container from "@/components/utils/Container";

interface Channel {
  icon: React.ReactNode;
  name: string;
  handle: string;
  description: string;
  responseTime: string;
  href: string;
}

const CHANNELS: Channel[] = [
  {
    icon: <Phone className="size-4" />,
    name: "WhatsApp",
    handle: "+880 1XXX-XXXXXX",
    description: "Chat with our support team directly.",
    responseTime: "< 30 mins",
    href: "https://wa.me/8801XXXXXXXXX",
  },
  {
    icon: <Mail className="size-4" />,
    name: "Email",
    handle: "support@najjarfurniture.com",
    description: "For detailed queries and order records.",
    responseTime: "1–2 days",
    href: "mailto:support@najjarfurniture.com",
  },
  {
    icon: '<Facebook className="size-4" />',
    name: "Facebook",
    handle: "@NajjarFurniture",
    description: "Follow updates & showroom announcements.",
    responseTime: "1–2 days",
    href: "https://facebook.com",
  },
  {
    icon: '<Instagram className="size-4" />',
    name: "Instagram",
    handle: "@najjarfurniture",
    description: "Behind-the-scenes craftsmanship & new pieces.",
    responseTime: "2–3 days",
    href: "https://instagram.com",
  },
  {
    icon: '<Youtube className="size-4" />',
    name: "YouTube",
    handle: "Najjar Furniture",
    description: "Workshop tours and care & maintenance tips.",
    responseTime: "2–3 days",
    href: "https://youtube.com",
  },
  {
    icon: '<Linkedin className="size-4" />',
    name: "LinkedIn",
    handle: "Najjar Furniture Co.",
    description: "Partnership & wholesale inquiries.",
    responseTime: "2–3 days",
    href: "https://linkedin.com",
  },
];

export default function ConnectChannels() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#f2ead9] px-3.5 py-1 text-[10.5px] font-medium text-[#6b3f22]">
            Find Us Everywhere
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[#6b3f22] md:text-4xl">
            Connect on Social Media
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[#3a2c22]/70">
            Follow Najjar Furniture for the latest craftsmanship, warmth, tips, and updates.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel) => (
            <Link
              key={channel.name}
              href={channel.href}
              className="flex flex-col gap-3 rounded-2xl border border-[#e5ded3] bg-[#fdf6ee] p-5 transition-colors hover:border-[#c9a06a]"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#6b3f22] text-[#f2ead9]">
                  {channel.icon}
                </span>
                <span className="text-sm font-semibold text-[#2b1810]">{channel.name}</span>
              </div>

              <p className="text-[11.5px] text-[#3a2c22]/60">{channel.handle}</p>
              <p className="text-[12px] leading-relaxed text-[#3a2c22]/75">{channel.description}</p>

              <p className="mt-1 text-[11px] font-medium text-[#6b3f22]">
                Response · {channel.responseTime}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}