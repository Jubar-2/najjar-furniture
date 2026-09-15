"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import TiptapEditor from "@/components/control-panel/pages/TiptapEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AboutImage {
    url?: string;
    publicId?: string;
}

interface AboutContent {
    paragraph?: string;
    image?: AboutImage;
}

const QUERY_KEY = ["home-about"];

export default function AboutAdmin() {
    const queryClient = useQueryClient();

    const [paragraph, setParagraph] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useQuery<AboutContent | null>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await fetch("/api/control-panel/page/home/about");
            if (res.status === 404) return null; // section doesn't exist yet
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error ?? "Failed to load.");
            }
            const json = await res.json();
            const c: AboutContent = json.data?.content ?? null;
            if (c) setParagraph(c.paragraph ?? "");
            return c;
        },
    });

    // ── Save ───────────────────────────────────────────────────────────────
    const mutation = useMutation({
        mutationFn: async () => {
            const isCreate = !content;

            if (isCreate) {
                if (!paragraph.replace(/<[^>]*>/g, "").trim()) {
                    throw new Error("Paragraph is required.");
                }
                if (!imageFile) {
                    throw new Error("Image is required.");
                }
            } else {
                const noTextChange = paragraph === (content?.paragraph ?? "");
                const noImageChange = !imageFile;
                if (noTextChange && noImageChange) {
                    throw new Error("No changes to save.");
                }
            }

            const formData = new FormData();
            formData.append("paragraph", paragraph);
            if (imageFile) formData.append("image", imageFile);

            // PATCH creates the section on first save and updates it afterward.
            const res = await fetch("/api/control-panel/page/home/about", {
                method: "PATCH",
                body: formData,
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Save failed.");
            return json;
        },
        onSuccess: () => {
            setSuccess(true);
            setError(null);
            setImageFile(null);
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Save failed.");
            setSuccess(false);
        },
    });

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                    Saved.
                </div>
            )}

            <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-neutral-500">Paragraph</span>
                <TiptapEditor content={paragraph} onChange={setParagraph} />
            </label>

            <div className="max-w-sm">
                <p className="mb-2 text-xs font-medium text-neutral-500">Image</p>
                <ImageUpload
                    value={content?.image?.url}
                    aspect="video"
                    onChange={(file) => setImageFile(file)}
                />
            </div>

            <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {content ? "Save Changes" : "Create About"}
            </Button>
        </div>
    );
}