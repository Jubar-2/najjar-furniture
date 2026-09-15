export interface SitePageMeta {
  pageName: string;
  route: string;
  label: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
}

/**
 * Every public page of the app, keyed by the `pageName` used in the Page
 * model. The meta admin lists these and the frontend generateMetadata()
 * helper reads the saved values (falling back to these defaults).
 */
export const SITE_PAGES: SitePageMeta[] = [
  {
    pageName: "home",
    route: "/",
    label: "Home",
    defaultTitle: "Najjar Furniture – Timeless Furniture, Thoughtfully Crafted",
    defaultDescription:
      "Najjar Furniture offers handcrafted, timeless furniture for every room. Explore our portfolio of beautifully designed home and office pieces.",
    defaultKeywords: "furniture, handcrafted furniture, najjar furniture, custom furniture, home decor",
  },
  {
    pageName: "about-us",
    route: "/about-us",
    label: "About Us",
    defaultTitle: "About Us – Najjar Furniture",
    defaultDescription:
      "Learn about Najjar Furniture – our story, our craftsmanship, and our commitment to building timeless furniture that lasts for generations.",
    defaultKeywords: "about najjar furniture, furniture craftsmanship, furniture story",
  },
  {
    pageName: "portfolio",
    route: "/portfolio",
    label: "Portfolio",
    defaultTitle: "Portfolio – Najjar Furniture",
    defaultDescription:
      "Browse the Najjar Furniture portfolio – a showcase of our handcrafted sofas, dining tables, beds, and custom furniture projects.",
    defaultKeywords: "furniture portfolio, custom furniture, furniture projects, sofas, dining tables",
  },
  {
    pageName: "contact",
    route: "/contact-us",
    label: "Contact Us",
    defaultTitle: "Contact Us – Najjar Furniture",
    defaultDescription:
      "Get in touch with Najjar Furniture. Call us, send an email, or message us on WhatsApp to discuss your custom furniture needs.",
    defaultKeywords: "contact najjar furniture, furniture showroom, custom furniture quote",
  },
  {
    pageName: "privacy-policy",
    route: "/privacy-policy",
    label: "Privacy Policy",
    defaultTitle: "Privacy Policy – Najjar Furniture",
    defaultDescription:
      "Read the Najjar Furniture privacy policy to understand how we collect, use, and protect your personal information.",
    defaultKeywords: "privacy policy, najjar furniture privacy",
  },
  {
    pageName: "terms-conditions",
    route: "/terms-conditions",
    label: "Terms & Conditions",
    defaultTitle: "Terms & Conditions – Najjar Furniture",
    defaultDescription:
      "Read the Najjar Furniture terms & conditions governing the use of our website, orders, custom furniture, and delivery.",
    defaultKeywords: "terms and conditions, najjar furniture terms, order policy",
  },
];

export const SITE_PAGES_MAP = new Map(SITE_PAGES.map((p) => [p.pageName, p]));

export function getSitePage(pageName: string): SitePageMeta | undefined {
  return SITE_PAGES_MAP.get(pageName);
}

export const SITE_NAME = "Najjar Furniture";