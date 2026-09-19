import PageBanner from "@/components/app/PageBanner";
import Container from "@/components/utils/Container";
import Footer from "@/components/app/Footer";
import { TermsConditionsSkeleton } from "./page";

export default function TermsConditionsLoading() {
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
            <TermsConditionsSkeleton />
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
