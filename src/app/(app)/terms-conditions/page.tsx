import { Suspense } from "react";
import PageBanner from "@/components/app/PageBanner";
import Container from "@/components/utils/Container";
import Footer from "@/components/app/Footer";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import { getPageContent } from "@/lib/getPageContent";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("terms-conditions"));
}

export function TermsConditionsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-3.5 w-36 bg-slate-200/70" />

      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-[95%] bg-slate-100" />
        <Skeleton className="h-4 w-[85%] bg-slate-100" />
      </div>

      <div className="space-y-3 pt-4">
        <Skeleton className="h-6 w-56 bg-slate-200/80 mb-3" />
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-[92%] bg-slate-100" />
        <Skeleton className="h-4 w-[88%] bg-slate-100" />
      </div>

      <div className="space-y-3 pt-4">
        <Skeleton className="h-6 w-48 bg-slate-200/80 mb-3" />
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-[96%] bg-slate-100" />
        <Skeleton className="h-4 w-[75%] bg-slate-100" />
      </div>

      <div className="space-y-3 pt-4">
        <Skeleton className="h-6 w-52 bg-slate-200/80 mb-3" />
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-[90%] bg-slate-100" />
      </div>
    </div>
  );
}

async function TermsConditionsBody() {
  const dynamicContent = await getPageContent("terms-conditions");
  const hasDynamicBody = Boolean(dynamicContent?.body && dynamicContent.body.trim());

  if (!hasDynamicBody) {
    return (
      <div className="py-12 text-center text-sm text-neutral-400">
        No terms &amp; conditions content available.
      </div>
    );
  }

  const updatedLabel = dynamicContent?.updatedAt
    ? dynamicContent.updatedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null;

  return (
    <>
      {updatedLabel && (
        <p className="text-[12px] text-[#3a2c22]/60" suppressHydrationWarning>
          Last updated: {updatedLabel}
        </p>
      )}

      <div
        className="prose prose-slate mt-6 max-w-none prose-h1:mb-3 prose-h1:font-serif prose-h1:font-semibold prose-h2:text-[#6b3f22] prose-p:text-[13.5px] prose-p:leading-relaxed prose-a:underline"
        dangerouslySetInnerHTML={{ __html: dynamicContent!.body }}
      />
    </>
  );
}

export default async function TermsPage() {
  const banner = await getPageBanner("terms-conditions");

  return (
    <main>
      <PageBanner
        imageSrc={banner?.image || "/images/legal-banner.jpg"}
        title={banner?.title || "Terms & Conditions"}
        breadcrumb={[{ label: "Home", href: "/" }]}
      />

      <section className="bg-white py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Suspense fallback={<TermsConditionsSkeleton />}>
              <TermsConditionsBody />
            </Suspense>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}