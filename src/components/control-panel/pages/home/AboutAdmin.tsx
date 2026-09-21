"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import TiptapEditor from "@/components/control-panel/pages/TiptapEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetHomeAbout, HOME_ABOUT_QUERY_KEY } from "@/customHooks/useHomeAbout";
import { convertImageToWebp } from "@/lib/clientImageToWebp";

export default function AboutAdmin() {
    const queryClient = useQueryClient();

    const [paragraph, setParagraph] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const hasInitializedRef = useRef(false);

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useGetHomeAbout();

    // Populate paragraph once when content is loaded
    useEffect(() => {
        if (content && !hasInitializedRef.current) {
            setParagraph(content.paragraph ?? "");
            hasInitializedRef.current = true;
        }
    }, [content]);

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
            if (imageFile) {
                const webpFile = await convertImageToWebp(imageFile);
                formData.append("image", webpFile);
            }

            // PATCH creates the section on first save and updates it afterward.
            try {
                const { data } = await axios.patch("/api/control-panel/page/home/about", formData);
                return data;
            } catch (err: unknown) {
                const message = axios.isAxiosError(err)
                    ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
                    : (err instanceof Error ? err.message : "Save failed.");
                throw new Error(message);
            }
        },
        onSuccess: () => {
            setSuccess(true);
            setError(null);
            setImageFile(null);
            hasInitializedRef.current = false;
            queryClient.invalidateQueries({ queryKey: HOME_ABOUT_QUERY_KEY });
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