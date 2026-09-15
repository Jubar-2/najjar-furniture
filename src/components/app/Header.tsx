"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
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

  return (
    <header
      className={`absolute top-0 left-0  w-full z-20  py-5  ${className}`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[#f2ead9]">
            <Image src={Logo} alt="Najjar Furniture" className="h-23.5 w-23.5 rounded-full" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] text-[#f2ead9]/90 transition-colors hover:text-[#f2ead9] ${i === 0 ? "border-b border-[#c9a06a] pb-1 text-[#f2ead9]" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact-us"
              className="ml-2 rounded-full bg-[#c9a06a] px-5 py-1.5 text-[13px] font-medium text-[#2c160d] transition-colors hover:bg-[#b98f5c]"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex size-9 items-center justify-center rounded-full bg-[#f2ead9]/95 text-[#0f0b08] md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          {/* Mobile nav panel */}
          {mobileOpen && (
            <div className="absolute inset-x-0 top-full flex flex-col gap-1 bg-[#0f0b08]/95 px-6 py-4 backdrop-blur-sm md:hidden">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm text-[#f2ead9]/90 hover:text-[#f2ead9]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact-us"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-[#c9a06a] px-4 py-2 text-center text-sm font-medium text-[#2c160d] hover:bg-[#b98f5c]"
              >
                Get a Quote
              </Link>
              <div className="mt-2 flex items-center gap-2 rounded-full bg-[#f2ead9]/95 px-4 py-2">
                <Search className="size-3.5 text-[#0f0b08]/50" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-transparent text-[12px] text-[#0f0b08] placeholder:text-[#0f0b08]/45 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

      </Container>

    </header>
  );
}