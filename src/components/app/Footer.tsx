"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Container from "@/components/utils/Container";
import logo from "@/assets/image/logo/brand-logo.png";
import Image from "next/image";
import { DEFAULT_CONTACT, waLink } from "@/lib/contact";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useGetContact } from "@/customHooks/useContact";
import { SocialIcon } from "@/components/ui/SocialIcons";
import type { ContactSection } from "@/schemas/contact.schema";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

interface FooterProps {
  brandName?: string;
  tagline?: string[];
  initialContact?: ContactSection;
}

export default function Footer({
  brandName = "Najjar Furniture",
  tagline = ["Timeless Furniture,", "Thoughtfully Crafted."],
  initialContact,
}: FooterProps) {
  const { data: remoteContact } = useGetContact();
  const contact = remoteContact || initialContact || DEFAULT_CONTACT;

  const socials = contact.socials && contact.socials.length > 0
    ? contact.socials
    : DEFAULT_CONTACT.socials;

  const primaryEmail = contact.emails?.[0]?.value || DEFAULT_CONTACT.emails[0]?.value || "";
  const primaryPhone = contact.phones?.[0]?.value || DEFAULT_CONTACT.phones[0]?.value || "";
  const primaryWhatsapp = contact.whatsapps?.[0]?.value || DEFAULT_CONTACT.whatsapps[0]?.value || "";
  const address = contact.address || DEFAULT_CONTACT.address;
  const showroomHours = contact.showroomHours || DEFAULT_CONTACT.showroomHours;

  const phoneDigits = primaryPhone.replace(/\D/g, "");

  const contactItems = [
    { Icon: MapPin, label: "Address", value: address, href: undefined as string | undefined },
    {
      Icon: Phone,
      label: "Phone",
      value: primaryPhone,
      href: phoneDigits ? `tel:+${phoneDigits}` : undefined,
    },
    {
      Icon: Mail,
      label: "Email",
      value: primaryEmail,
      href: primaryEmail ? `mailto:${primaryEmail}` : undefined,
    },
    {
      Icon: Clock,
      label: "Showroom Hours",
      value: showroomHours,
      href: primaryWhatsapp ? waLink(primaryWhatsapp) : undefined,
    },
  ];

  return (
    <footer className="bg-[#2c160d] text-[#f2ead9]">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:gap-10 py-10 sm:py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl italic text-[#c9a06a]">
                <Image
                  src={logo}
                  width={65}
                  height={65}
                  alt="logo"
                  className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-full"
                />
              </span>
            </div>
            <p className="mt-2 text-xs tracking-wide text-[#f2ead9]/70">{brandName}</p>

            <p className="mt-4 font-serif text-lg sm:text-xl italic leading-snug text-[#f2ead9]">
              {tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            {/* Dynamic Social Media Channels */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socials
                .filter((s) => s.name && s.url)
                .map((social) => {
                  const href =
                    social.name?.toLowerCase() === "whatsapp"
                      ? getWhatsAppUrl(social.url)
                      : social.url;
                  return (
                    <Link
                      key={social.name + social.url}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className="group flex size-8 items-center justify-center rounded-full bg-[#f2ead9] text-[#2c160d] transition-all hover:bg-[#c9a06a] hover:scale-110 shadow-2xs"
                    >
                      <SocialIcon
                        platform={social.name}
                        size={15}
                        className="transition-transform group-hover:scale-105"
                      />
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#f2ead9]">Quick Links</h3>
            <ul className="mt-3.5 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-[12.5px] text-[#f2ead9]/70 transition-colors hover:text-[#f2ead9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-[#f2ead9]">Contact Us</h3>
            <ul className="mt-3.5 space-y-3">
              {contactItems.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-[#c9a06a]" />
                  <div className="text-xs sm:text-[12.5px] leading-snug text-[#f2ead9]/70 min-w-0 flex-1 wrap-break-word">
                    <span className="block text-[10px] uppercase tracking-wide text-[#f2ead9]/80">
                      {label}
                    </span>
                    {href ? (
                      <Link
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="transition-colors hover:text-[#f2ead9] break-all"
                      >
                        {value}
                      </Link>
                    ) : (
                      <span className="break-all">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-[#f2ead9]/10 bg-[#3d2115] shadow-[0px_-3px_31.9px_0px_#00000040]">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 py-4 text-center sm:text-left text-xs sm:text-[11.5px] text-[#f2ead9]/70 sm:flex-row">
            <p>
              © {new Date().getFullYear()} All Rights Reserved -{" "}
              <span className="font-semibold text-[#f2ead9]">{brandName}</span>
            </p>
            <p className="flex items-center gap-2">
              <Link href="/privacy-policy" className="hover:text-[#f2ead9]">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms-conditions" className="hover:text-[#f2ead9]">
                Terms
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}