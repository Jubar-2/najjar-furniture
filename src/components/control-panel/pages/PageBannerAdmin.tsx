"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Upload, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetPageBanner, useUpdatePageBanner } from "@/customHooks/usePageBanner";

interface PageBannerAdminProps {
  pageName: string;
  defaultTitle: string;
  defaultImage: string;
}

export default function PageBannerAdmin({
  pageName,
  defaultTitle,
  defaultImage,
}: PageBannerAdminProps) {
  const { data, isLoading } = useGetPageBanner(pageName);
  const mutation = useUpdatePageBanner(pageName);

  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const hasInitializedRef = useRef(false);

  // Sync data once when loaded
  useEffect(() => {
    if (data && !hasInitializedRef.current) {
      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      hasInitializedRef.current = true;
    }
  }, [data]);

  // Handle local file preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const currentImageSrc = previewUrl || data?.image || defaultImage;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData();
    if (title.trim()) formData.append("title", title.trim());
    if (subtitle.trim()) formData.append("subtitle", subtitle.trim());
    if (file) formData.append("image", file);

    try {
      await mutation.mutateAsync(formData);
      setStatusMessage({ type: "success", text: "Banner updated successfully!" });
      setFile(null);
      hasInitializedRef.current = false;
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update banner.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-neutral-500">
        <Loader2 className="mr-2 size-4 animate-spin" /> Loading banner settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Page Banner</h2>
          <p className="text-xs text-slate-500">
            Upload the top banner image and configure heading for this page.
          </p>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save Changes
        </Button>
      </div>

      {statusMessage && (
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm transition-all",
            statusMessage.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          )}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Live Preview Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Live Banner Preview
          </span>
          <span className="text-[11px] text-slate-400">
            {previewUrl ? "Previewing new upload" : data?.image ? "Custom uploaded image" : "Default fallback"}
          </span>
        </div>

        <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-lg bg-[#0f0b08] shadow-inner flex flex-col items-center justify-center text-center p-4">
          <Image
            src={currentImageSrc}
            alt="Banner preview"
            fill
            className="object-cover object-center"
            unoptimized={currentImageSrc.startsWith("blob:")}
          />
          <div className="absolute inset-0 bg-[#0f0b08]/75 pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#f2ead9]">
              {title || defaultTitle}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#f2ead9]/80 max-w-md mx-auto">
                {subtitle}
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#f2ead9]/70 pt-1">
              <span>Home</span>
              <ChevronRight className="size-3 text-[#f2ead9]/40" />
              <span className="text-[#c9a06a]">{title || defaultTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload and Title Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image File Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Banner Image {data?.image ? "(Optional — leave empty to keep current)" : "(Required for custom image)"}
          </label>
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center cursor-pointer hover:border-slate-400 transition-colors">
            <div className="rounded-full bg-slate-100 p-3 text-slate-600">
              <Upload className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : "Click to select a banner image"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Recommended: 1920×600 (JPG, PNG, WEBP), max 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Text Customization */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Banner Heading / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={defaultTitle}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displays as the primary headline on the banner overlay.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Banner Subtitle (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Discover our heritage and dedication to craftsmanship"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Optional subtext displayed under the main heading.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
