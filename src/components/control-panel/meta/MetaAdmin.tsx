"use client";

import { useGetPageMeta } from "@/customHooks/usePageMeta";
import MetaEditor from "./MetaEditor";

export default function MetaAdmin() {
  const { data: pages, isLoading } = useGetPageMeta();

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading…</p>;
  }

  if (!pages || pages.length === 0) {
    return <p className="text-sm text-neutral-500">No pages configured.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Meta & SEO</h1>
          <p className="text-xs text-neutral-500">
            Page title, meta description, keywords, OG image, and author for every page.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {pages.map((page) => (
          <MetaEditor key={page.pageName} page={page} />
        ))}
      </div>
    </div>
  );
}