"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "../utils/Container";
import Image from "next/image";
import Logo from "@/assets/image/logo/brand-logo.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);

  };

  return (
    <header
      className={`absolute top-0 left-0 w-full z-40 py-3 sm:py-4 md:py-5 ${className}`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-[#f2ead9]">
              <Image
                src={Logo}
                alt="Najjar Furniture"
                width={43}
                height={42}
                priority
                unoptimized
                className="w-10.75 h-10.5 rounded-full object-cover shrink-0"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] xl:text-sm font-medium transition-colors ${active
                      ? "border-b border-[#c9a06a] pb-1 text-[#f2ead9]"
                      : "text-[#f2ead9]/90 hover:text-[#f2ead9]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact-us"
              className="ml-2 rounded-full bg-[#c9a06a] px-4 xl:px-5 py-2 text-[13px] font-medium text-[#2c160d] transition-all hover:bg-[#b98f5c] hover:shadow-md shrink-0"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile toggle (visible on all screens < 1024px including tablets) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-[#f2ead9]/95 text-[#0f0b08] lg:hidden shrink-0 shadow-sm transition-transform active:scale-95"
          >
            {mobileOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
          </button>

          {/* Mobile nav panel */}
          {mobileOpen && (
            <div className="absolute inset-x-0 top-full z-50 flex flex-col gap-1.5 bg-[#0f0b08]/95 px-4 sm:px-6 py-4 shadow-2xl backdrop-blur-md max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 lg:hidden">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                        ? "text-[#f2ead9] underline underline-offset-4 decoration-[#c9a06a] decoration-2 font-semibold bg-white/5"
                        : "text-[#f2ead9]/90 hover:bg-white/10 hover:text-[#f2ead9]"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact-us"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-[#c9a06a] px-4 py-2.5 text-center text-sm font-semibold text-[#2c160d] transition-colors hover:bg-[#b98f5c]"
              >
                Get a Quote
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}