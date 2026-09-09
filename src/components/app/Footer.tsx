import Link from "next/link";
// import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import Container from "@/components/utils/Container";
import logo from "@/assets/image/logo/brand-logo.png";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const CONTACT_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "E-mail", href: "mailto:hello@najjarfurniture.com" },
];

const SOCIAL_ICONS = [
  { icon: <></>, href: "https://facebook.com", label: "Facebook" },
  { icon: <></>, href: "https://instagram.com", label: "Instagram" },
  { icon: <></>, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <></>, href: "mailto:hello@najjarfurniture.com", label: "Email" },
];

interface FooterProps {
  brandName?: string;
  tagline?: string[];
}

export default function Footer({
  brandName = "Najjar Furniture",
  tagline = ["Timeless Furniture,", "Thoughtfully Crafted."],
}: FooterProps) {
  return (
    <footer className="bg-[#2c160d] text-[#f2ead9]">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl italic text-[#c9a06a]">
                <Image
                  src={logo}
                  width={65}
                  alt="logo"
                />
              </span>
            </div>
            <p className="mt-1 text-[11px] tracking-wide text-[#f2ead9]/70">{brandName}</p>

            <p className="mt-5 font-serif text-xl italic leading-snug text-[#f2ead9]">
              {tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full bg-[#f2ead9] text-[#2c160d] transition-colors hover:bg-[#c9a06a]"
                >
                  {/* <Icon className="size-4" /> */}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#f2ead9]">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-[#f2ead9]/70 transition-colors hover:text-[#f2ead9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#f2ead9]">Contact Us</h3>
            <ul className="mt-4 space-y-2.5">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-[#f2ead9]/70 transition-colors hover:text-[#f2ead9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-[#f2ead9]/10 bg-[#3d2115]">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 py-4 text-[11.5px] text-[#f2ead9]/70 sm:flex-row">
            <p>
              © {new Date().getFullYear()} All Rights Reserved -{" "}
              <span className="font-semibold text-[#f2ead9]">{brandName}</span>
            </p>
            <p className="flex items-center gap-2">
              <Link href="/privacy-policy" className="hover:text-[#f2ead9]">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-[#f2ead9]">
                Terms
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}