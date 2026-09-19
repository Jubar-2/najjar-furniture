import { Suspense } from "react";
import axios from "axios";
import PageBanner from "@/components/app/PageBanner";
import Container from "@/components/utils/Container";
import Footer from "@/components/app/Footer";
import dbConnect from "@/db/dbConnect";
import PageModel from "@/models/page.model";
import PageSection from "@/models/pageSections.model";
import { getPageMeta, buildMetadata } from "@/lib/getPageMeta";
import { getPageBanner } from "@/lib/getPageBanner";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageMeta("terms-conditions"));
}

async function getBaseUrl() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function getTermsConditionsContent() {
  // 1. Fetch via /api/page/terms-conditions route
  try {
    const baseUrl = await getBaseUrl();
    const { data } = await axios.get(`${baseUrl}/api/page/terms-conditions`);
    const body = data.data?.content?.body;
    if (typeof body === "string" && body.trim()) {
      return {
        body,
        updatedAt: data.data?.updatedAt ? new Date(data.data.updatedAt) : null,
      };
    }
  } catch (error) {
    console.error("Fetch from /api/page/terms-conditions failed, using fallback:", error);
  }

  // 2. Direct database fallback if fetch is not reachable
  try {
    await dbConnect();

    const page = await PageModel.findOne({ pageName: "terms-conditions" });
    if (!page) return null;

    const section = await PageSection.findOne({
      pageId: page._id,
      type: "terms-conditions",
      isActive: true,
    }).lean();

    const body = section?.content?.body;
    if (typeof body !== "string" || !body.trim()) return null;

    return {
      body,
      updatedAt: section?.updatedAt ? new Date(section.updatedAt) : null,
    };
  } catch (error) {
    console.error("Failed to load terms & conditions content from database:", error);
    return null;
  }
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
  const dynamicContent = await getTermsConditionsContent();

  if (!dynamicContent) {
    return (
      <div className="py-12 text-center text-sm text-neutral-400">
        No terms &amp; conditions content available.
      </div>
    );
  }

  const updatedLabel = dynamicContent.updatedAt
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
        dangerouslySetInnerHTML={{ __html: dynamicContent.body }}
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