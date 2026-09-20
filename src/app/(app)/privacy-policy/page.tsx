import PageBanner from "@/components/app/PageBanner";
import Container from "@/components/utils/Container";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import { getPageContent } from "@/lib/getPageContent";
import type { Metadata } from "next";

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("privacy-policy"));
}

const LAST_UPDATED = "September 10, 2026";

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us, such as when you place an order, request a custom quote, create an account, sign up for our newsletter, or contact our support team. This may include your name, email address, phone number, delivery address, and payment details.",
      "We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, and pages viewed, through cookies and similar technologies.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "We use the information we collect to process and fulfill your orders, communicate with you about your purchase or inquiry, provide customer support, improve our products and website, and — where you've opted in — send you updates about new collections and promotions.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    heading: "3. Cookies & Tracking Technologies",
    body: [
      "Our website uses cookies to remember your preferences, keep items in your cart, and understand how visitors use our site so we can improve it. You can control or disable cookies through your browser settings, though some parts of the site may not function properly without them.",
    ],
  },
  {
    heading: "4. Sharing Your Information",
    body: [
      "We may share your information with trusted third parties who help us operate our business — such as payment processors, delivery and logistics partners, and email service providers — solely for the purpose of fulfilling your order or providing our services. These partners are contractually obligated to protect your data.",
      "We may also disclose information if required by law, or to protect the rights, property, or safety of Najjar Furniture, our customers, or others.",
    ],
  },
  {
    heading: "5. Data Retention",
    body: [
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with our legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    heading: "6. Your Rights",
    body: [
      "Depending on your location, you may have the right to access, correct, delete, or export your personal information, and to object to or restrict certain processing. To exercise any of these rights, please contact us using the details below.",
    ],
  },
  {
    heading: "7. Data Security",
    body: [
      "We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "8. Children's Privacy",
    body: [
      "Our website and services are not directed to individuals under the age of 16, and we do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "9. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
    ],
  },
  {
    heading: "10. Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at support@najjarfurniture.com or through the contact details on our Contact Us page.",
    ],
  },
];

export default async function PrivacyPolicyPage() {
  const [dynamicContent, banner] = await Promise.all([
    getPageContent("privacy-policy"),
    getPageBanner("privacy-policy"),
  ]);

  const hasDynamicBody = Boolean(
    dynamicContent?.body && dynamicContent.body.trim()
  );

  const updatedLabel = dynamicContent?.updatedAt
    ? dynamicContent.updatedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : LAST_UPDATED;

  return (
    <main>
      <PageBanner
        imageSrc={banner?.image || "/images/legal-banner.jpg"}
        title={banner?.title || "Privacy Policy"}
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <section className="bg-white py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] text-[#3a2c22]/75" suppressHydrationWarning>
              Last updated: {updatedLabel}
            </p>

            {hasDynamicBody ? (
              <div
                className="prose prose-slate mt-6 max-w-none prose-h2:mb-3 prose-h2:font-serif prose-h2:font-semibold prose-h2:text-[#6b3f22] prose-p:text-[13.5px] prose-p:leading-relaxed prose-a:underline"
                dangerouslySetInnerHTML={{ __html: dynamicContent!.body }}
              />
            ) : (
              <>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[#2b241f]/85">
                  Najjar Furniture (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
                  protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website or make a purchase from us.
                </p>

                <div className="mt-10 space-y-9">
                  {SECTIONS.map((section) => (
                    <div key={section.heading}>
                      <h2 className="text-lg font-semibold text-[#6b3f22]">{section.heading}</h2>
                      <div className="mt-2.5 space-y-3">
                        {section.body.map((paragraph, i) => (
                          <p key={i} className="text-[13.5px] leading-relaxed text-[#2b241f]/80">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}