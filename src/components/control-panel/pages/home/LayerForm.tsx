"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Field from "./Field";
import { convertImageToWebp } from "@/lib/clientImageToWebp";

export interface LayerContent {
    heading: string;
    paragraph: string;
    image: string;
    imagePublicId?: string;
}

export default function LayerForm({ layer }: { layer: "1" | "2" }) {
    const queryClient = useQueryClient();

    const [form, setForm] = useState({ heading: "", paragraph: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const hasInitializedRef = useRef(false);

    const queryKey = ["home-layer", layer];

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useQuery<LayerContent | null>({
        queryKey,
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/page/home/layer${layer}`);
                return data.data.content;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return null; // section doesn't exist yet
                }
                const message = axios.isAxiosError(err)
                    ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
                    : "Failed to load.";
                throw new Error(message);
            }
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Populate form once when content is loaded
    useEffect(() => {
        if (content && !hasInitializedRef.current) {
            setForm({ heading: content.heading ?? "", paragraph: content.paragraph ?? "" });
            hasInitializedRef.current = true;
        }
    }, [content]);

    // ── Save ───────────────────────────────────────────────────────────────
    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            if (form.heading) formData.append("heading", form.heading);
            if (form.paragraph) formData.append("paragraph", form.paragraph);
            if (imageFile) {
                const webpFile = await convertImageToWebp(imageFile);
                formData.append("image", webpFile);
            }

            const method = content ? "PATCH" : "POST";

            if (method === "POST" && !imageFile) {
                throw new Error("An image is required to create this layer.");
            }

            try {
                const url = `/api/control-panel/page/home/layer${layer}`;
                const { data } = method === "PATCH"
                    ? await axios.patch(url, formData)
                    : await axios.post(url, formData);
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
            setImageFile(null);
            setError(null);
            hasInitializedRef.current = false;
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Save failed.");
            setSuccess(false);
        },
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        mutation.mutate();
    }

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    const isSaving = mutation.isPending;

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
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

                <Field label="Heading">
                    <input
                        value={form.heading}
                        onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                        className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none"
                        required={!content}
                    />
                </Field>

                <Field label="Paragraph">
                    <textarea
                        rows={4}
                        value={form.paragraph}
                        onChange={(e) => setForm((f) => ({ ...f, paragraph: e.target.value }))}
                        className="w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none"
                        required={!content}
                    />
                </Field>

                <Field label={`Image ${content ? "(optional — leave blank to keep current)" : ""}`}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-neutral-400">
                        {isConverting ? (
                            <Loader2 className="size-4 animate-spin text-primary" />
                        ) : (
                            <Upload className="size-4" />
                        )}
                        {isConverting
                            ? "Converting to WebP…"
                            : imageFile
                            ? imageFile.name
                            : "Choose an image"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isConverting}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) {
                                    setImageFile(null);
                                    return;
                                }
                                setIsConverting(true);
                                try {
                                    const webpFile = await convertImageToWebp(file);
                                    setImageFile(webpFile);
                                } finally {
                                    setIsConverting(false);
                                }
                            }}
                        />
                    </label>
                </Field>

                <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                    {content ? "Save Changes" : "Create Layer"}
                </Button>
            </div>

            <div>
                <p className="mb-2 text-xs font-medium text-neutral-500">Current image</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                    {imageFile ? (
                        <Image src={URL.createObjectURL(imageFile)} alt="" fill className="object-contain" />
                    ) : content?.image ? (
                        <Image src={content.image} alt="" fill className="object-contain" />
                    ) : (
                        <p className="flex h-full items-center justify-center text-xs text-neutral-400">
                            No image yet
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}