import PageBanner from "@/components/app/PageBanner";
import Container from "@/components/utils/Container";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("terms-conditions"));
}

const LAST_UPDATED = "September 10, 2026";

const SECTIONS = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      "By accessing or using the Najjar Furniture website, placing an order, or otherwise engaging with our services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.",
    ],
  },
  {
    heading: "2. Products & Descriptions",
    body: [
      "We make every effort to display our furniture and finishes as accurately as possible. However, because much of our furniture is handcrafted from natural wood, slight variations in grain, color, and texture between the product shown and the item you receive are normal and not considered defects.",
      "We reserve the right to modify, discontinue, or limit the availability of any product without prior notice.",
    ],
  },
  {
    heading: "3. Pricing & Payment",
    body: [
      "All prices are listed in the applicable local currency and are subject to change without notice. For custom or made-to-order pieces, a deposit may be required before production begins, with the balance due prior to delivery. Full payment terms will be confirmed at the time of order.",
    ],
  },
  {
    heading: "4. Custom & Made-to-Order Items",
    body: [
      "Custom orders are built to your specified dimensions, wood finish, and upholstery. Because these pieces are made specifically for you, custom orders are generally non-refundable and non-cancellable once production has begun, except where required by law or explicitly agreed in writing.",
      "Estimated production and delivery timelines are provided in good faith but are not guaranteed, as handcrafted work can be affected by material availability and workshop capacity.",
    ],
  },
  {
    heading: "5. Delivery & Risk of Loss",
    body: [
      "Delivery timelines communicated at checkout or by our team are estimates only. Risk of loss or damage to the product passes to you upon delivery. Please inspect your furniture upon arrival and report any visible damage to our team within 48 hours.",
    ],
  },
  {
    heading: "6. Returns, Exchanges & Warranty",
    body: [
      "Standard (non-custom) items may be eligible for return or exchange within the timeframe stated on our Returns policy, provided the item is unused and in its original condition. Custom and made-to-order pieces are final sale unless the item arrives defective.",
      "Our furniture is covered by a limited warranty against manufacturing defects in materials and craftsmanship for the period specified at the time of purchase. This warranty does not cover normal wear and tear, misuse, or damage caused by improper care.",
    ],
  },
  {
    heading: "7. Intellectual Property",
    body: [
      "All content on this website — including designs, photographs, text, logos, and graphics — is the property of Najjar Furniture and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content for commercial purposes without our prior written consent.",
    ],
  },
  {
    heading: "8. User Conduct",
    body: [
      "You agree not to misuse our website, including attempting to gain unauthorized access to our systems, submitting false information, or using the site for any unlawful purpose.",
    ],
  },
  {
    heading: "9. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Najjar Furniture shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products, beyond the purchase price of the relevant item.",
    ],
  },
  {
    heading: "10. Governing Law",
    body: [
      "These Terms & Conditions are governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law principles.",
    ],
  },
  {
    heading: "11. Changes to These Terms",
    body: [
      "We may update these Terms & Conditions from time to time. Continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.",
    ],
  },
  {
    heading: "12. Contact Us",
    body: [
      "If you have any questions about these Terms & Conditions, please contact us at support@najjarfurniture.com or through the details on our Contact Us page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main>
      <PageBanner
        imageSrc="/images/legal-banner.jpg"
        title="Terms & Conditions"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <section className="bg-white py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] text-[#3a2c22]/60">Last updated: {LAST_UPDATED}</p>

            <p className="mt-4 text-[13.5px] leading-relaxed text-[#2b241f]/85">
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the Najjar
              Furniture website and your purchase of any products from us. Please read them
              carefully before placing an order.
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
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}