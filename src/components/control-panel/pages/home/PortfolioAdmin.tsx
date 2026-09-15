"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import TiptapEditor from "@/components/control-panel/pages/TiptapEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PortfolioImage {
    url: string;
    publicId?: string;
}

interface PortfolioContent {
    paragraph?: string;
    image1?: PortfolioImage;
    image2?: PortfolioImage;
    image3?: PortfolioImage;
    image4?: PortfolioImage;
}

const IMAGE_KEYS = ["image1", "image2", "image3", "image4"] as const;
const QUERY_KEY = ["home-portfolio"];

export default function PortfolioAdmin() {
    const queryClient = useQueryClient();

    const [paragraph, setParagraph] = useState("");
    const [files, setFiles] = useState<Record<string, File>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useQuery<PortfolioContent | null>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await fetch("/api/control-panel/page/home/portfolio");
            if (res.status === 404) return null; // section doesn't exist yet
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error ?? "Failed to load.");
            }
            const json = await res.json();
            const c: PortfolioContent = json.data?.content ?? null;
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
                for (const key of IMAGE_KEYS) {
                    if (!files[key]) {
                        throw new Error(`Image ${key.replace("image", "")} is required.`);
                    }
                }
            } else {
                const noTextChange = paragraph === (content?.paragraph ?? "");
                const noImageChange = IMAGE_KEYS.every((key) => !files[key]);
                if (noTextChange && noImageChange) {
                    throw new Error("No changes to save.");
                }
            }

            const formData = new FormData();
            formData.append("paragraph", paragraph);
            for (const key of IMAGE_KEYS) {
                const file = files[key];
                if (file) formData.append(key, file);
            }

            // PATCH creates the section on first save and updates it afterward.
            const res = await fetch("/api/control-panel/page/home/portfolio", {
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
            setFiles({});
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {IMAGE_KEYS.map((key, i) => (
                    <div key={key}>
                        <p className="mb-2 text-xs font-medium text-neutral-500">Image {i + 1}</p>
                        <ImageUpload
                            value={content?.[key]?.url}
                            aspect="square"
                            onChange={(file) => {
                                if (file) setFiles((f) => ({ ...f, [key]: file }));
                            }}
                        />
                    </div>
                ))}
            </div>

            <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {content ? "Save Changes" : "Create Portfolio"}
            </Button>
        </div>
    );
}