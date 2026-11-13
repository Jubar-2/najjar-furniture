import React from "react";
import { getBaseUrl, getCanonicalUrl } from "@/lib/siteUrl";
import { SITE_NAME } from "@/lib/sitePages";

/**
 * Strips HTML tags for clean schema descriptions.
 */
function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Organization and LocalBusiness schema for Najjar Furniture.
 */
export function OrganizationJsonLd() {
  const baseUrl = getBaseUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    "@id": `${baseUrl}/#organization`,
    name: SITE_NAME,
    alternateName: "Najjar Riyadh Furniture",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/about-banner.jpg`,
    description:
      "Najjar Furniture offers handcrafted, timeless furniture for every room. Thoughtfully designed and precision-crafted in Riyadh, Saudi Arabia.",
    telephone: "+966573250180",
    email: "support.najjar.riyad.furniture@gmail.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "6231 Ibrahim Al Jayli, Al Sina'iyah, RENB3410, 3410",
      addressLocality: "Riyadh",
      postalCode: "12844",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.6467,
      longitude: 46.7412,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      "https://facebook.com/najjarfurniture",
      "https://instagram.com/najjarfurniture",
      "https://youtube.com/@najjarfurniture",
      "https://wa.me/966573250180",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite schema for the root website.
 */
export function WebSiteJsonLd() {
  const baseUrl = getBaseUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: SITE_NAME,
    url: baseUrl,
    description:
      "Najjar Furniture offers handcrafted, timeless furniture for every room. Explore our portfolio of beautifully designed home and office pieces.",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: ["en", "ar"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * BreadcrumbList schema for internal public pages.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: getCanonicalUrl(crumb.item),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface PortfolioItemSchemaData {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
}

/**
 * CollectionPage and ItemList schema for Portfolio works.
 */
export function PortfolioItemListJsonLd({
  items,
}: {
  items: PortfolioItemSchemaData[];
}) {
  const baseUrl = getBaseUrl();
  const portfolioUrl = getCanonicalUrl("/portfolio");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${portfolioUrl}#collection`,
    url: portfolioUrl,
    name: `Portfolio – ${SITE_NAME}`,
    description:
      "Browse the Najjar Furniture portfolio of handcrafted sofas, dining tables, beds, and custom furniture projects.",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((item, idx) => ({
        "@type": "CreativeWork",
        position: idx + 1,
        name: item.title,
        description: stripHtml(item.description) || item.title,
        image: item.image,
        genre: item.category || "Custom Furniture",
        creator: {
          "@id": `${baseUrl}/#organization`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

