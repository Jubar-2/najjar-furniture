"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useUpdatePageMeta } from "@/customHooks/usePageMeta";
import type { PageMetaRecord } from "@/customHooks/usePageMeta";

export default function MetaEditor({ page }: { page: PageMetaRecord }) {
  const updateMutation = useUpdatePageMeta();

  const [title, setTitle] = useState(page.title);
  const [metaTitle, setMetaTitle] = useState(page.meta_title);
  const [metaDescription, setMetaDescription] = useState(page.meta_description);
  const [metaKeywords, setMetaKeywords] = useState(page.meta_keywords);
  const [metaOgImage, setMetaOgImage] = useState(page.meta_og_image);
  const [metaAuthor, setMetaAuthor] = useState(page.meta_author);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async () => {
    setMessage(null);
    try {
      await updateMutation.mutateAsync({
        pageName: page.pageName,
        payload: {
          title: title.trim(),
          meta_title: metaTitle.trim(),
          meta_description: metaDescription.trim(),
          meta_keywords: metaKeywords.trim(),
          meta_og_image: metaOgImage.trim(),
          meta_author: metaAuthor.trim(),
        },
      });
      setMessage({ type: "success", text: "Saved." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800">{page.label}</h2>
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
            {page.route}
          </code>
        </div>
        <Button type="button" size="sm" onClick={handleSubmit} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          Save
        </Button>
      </div>

      {message && (
        <div
          className={
            message.type === "error"
              ? "mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              : "mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700"
          }
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Page Title</span>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Meta Title</span>
          <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={255} />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Meta Description</span>
          <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">
            Meta Keywords
            <span className="ml-1 text-[10px] text-neutral-400">(comma separated)</span>
          </span>
          <Textarea value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} rows={2} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">OG Image URL</span>
          <Input
            value={metaOgImage}
            onChange={(e) => setMetaOgImage(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Author</span>
          <Input value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)} />
        </label>
      </div>
    </Card>
  );
}