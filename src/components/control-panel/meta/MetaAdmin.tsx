"use client";

import { useGetPageMeta } from "@/customHooks/usePageMeta";
import MetaEditor from "./MetaEditor";
import GoogleVerificationCard from "./GoogleVerificationCard";

export default function MetaAdmin() {
  const { data: pages, isLoading } = useGetPageMeta();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">
            Meta & SEO
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Site-wide verification, page titles, meta descriptions, keywords, OG
            images, and authors.
          </p>
        </div>
      </div>

      {/* Global Google Search Console Verification */}
      <GoogleVerificationCard />

      {/* Per-Page Meta Editors */}
      <div className="space-y-4 pt-2">
        <div className="border-b border-slate-200/80 pb-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Page-Level Metadata
          </h2>
          <p className="text-xs text-slate-400">
            Customize search snippets and Open Graph social cards for each
            public page.
          </p>
        </div>

        {isLoading && (
          <p className="text-xs text-neutral-500 py-4">
            Loading page settings…
          </p>
        )}

        {!isLoading && (!pages || pages.length === 0) && (
          <p className="text-xs text-neutral-500 py-4">No pages configured.</p>
        )}

        {pages &&
          pages.map((page) => <MetaEditor key={page.pageName} page={page} />)}
      </div>
    </div>
  );
}
