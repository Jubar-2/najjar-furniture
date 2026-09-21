"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ItemEditor, { type ItemFormState, type ItemUploadStatus } from "./ItemEditor";
import { HOME_LAYER3_QUERY_KEY } from "@/customHooks/useHomeLayer3";
import { convertImageToWebp } from "@/lib/clientImageToWebp";

interface Item {
    heading: string;
    paragraph: string;
    image: string;
    imagePublicId?: string;
}

type Content = Record<"item1" | "item2" | "item3" | "item4" | "item5" | "item6", Item>;

const ITEM_KEYS = ["item1", "item2", "item3", "item4", "item5", "item6"] as const;

const QUERY_KEY = ["home-layer-three"];

export default function HomeLayerThreeForm() {
    const queryClient = useQueryClient();

    const [forms, setForms] = useState<Record<string, ItemFormState>>(
        Object.fromEntries(ITEM_KEYS.map((k) => [k, { heading: "", paragraph: "", imageFile: null }]))
    );
    const [itemStatuses, setItemStatuses] = useState<
        Record<string, { status: ItemUploadStatus; message?: string }>
    >(
        Object.fromEntries(ITEM_KEYS.map((k) => [k, { status: "idle" }]))
    );
    const [savingItemKey, setSavingItemKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const hasInitializedRef = useRef(false);

    // ── Single Item Save ───────────────────────────────────────────────────
    async function handleSaveSingleItem(key: (typeof ITEM_KEYS)[number]) {
        const num = key.replace("item", "");
        const state = forms[key];
        const existing = content?.[key as keyof Content];
        const isCreate = !content;
        const missingImage = !existing?.image;

        // Validation
        if (!state.heading.trim() || !state.paragraph.trim()) {
            setError(`Item ${num}: heading and paragraph are required.`);
            setSuccess(null);
            return;
        }

        if ((isCreate || missingImage) && !state.imageFile) {
            setError(`Item ${num}: an image is required.`);
            setSuccess(null);
            return;
        }

        setSavingItemKey(key);
        setError(null);
        setSuccess(null);

        setItemStatuses((prev) => ({
            ...prev,
            [key]: { status: "uploading" },
        }));

        const itemFormData = new FormData();
        if (state.heading.trim()) {
            itemFormData.append("heading", state.heading.trim());
        }
        if (state.paragraph.trim()) {
            itemFormData.append("paragraph", state.paragraph.trim());
        }
        if (state.imageFile) {
            const webpFile = await convertImageToWebp(state.imageFile);
            itemFormData.append("image", webpFile);
        }

        try {
            await axios.post(
                `/api/control-panel/page/home/layer3/item/${num}`,
                itemFormData
            );

            setItemStatuses((prev) => ({
                ...prev,
                [key]: { status: "success" },
            }));

            // Clear local file so it is not re-uploaded
            setForms((prev) => ({
                ...prev,
                [key]: { ...prev[key], imageFile: null },
            }));

            setSuccess(`Item ${num} saved successfully.`);
            setError(null);

            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: HOME_LAYER3_QUERY_KEY });
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
                ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
                : (err instanceof Error ? err.message : "Upload failed.");

            setItemStatuses((prev) => ({
                ...prev,
                [key]: { status: "error", message },
            }));

            setError(`Item ${num} failed to save: ${message}`);
            setSuccess(null);
        } finally {
            setSavingItemKey(null);
        }
    }

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useQuery<Content | null>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            try {
                const { data } = await axios.get("/api/page/home/layer3");
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

    // Populate form items once when content is loaded
    useEffect(() => {
        if (content && !hasInitializedRef.current) {
            setForms(
                Object.fromEntries(
                    ITEM_KEYS.map((k) => [
                        k,
                        { heading: content[k]?.heading ?? "", paragraph: content[k]?.paragraph ?? "", imageFile: null },
                    ])
                )
            );
            hasInitializedRef.current = true;
        }
    }, [content]);

    function updateItem(key: string, patch: Partial<ItemFormState>) {
        setForms((f) => ({ ...f, [key]: { ...f[key], ...patch } }));
        // Reset status for this item when modified
        setItemStatuses((s) => ({ ...s, [key]: { status: "idle" } }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        mutation.mutate();
    }

    // ── Sequential Save ────────────────────────────────────────────────────
    const mutation = useMutation({
        mutationFn: async () => {
            const isCreate = !content;
            const itemsToSave: (typeof ITEM_KEYS)[number][] = [];

            // Identify which items have changes or need creation
            for (const key of ITEM_KEYS) {
                const index = key.replace("item", "");
                const state = forms[key];
                const existing = content?.[key as keyof Content];

                const headingChanged = state.heading.trim() !== (existing?.heading ?? "");
                const paragraphChanged = state.paragraph.trim() !== (existing?.paragraph ?? "");
                const imageChanged = !!state.imageFile;
                const missingImage = !existing?.image;

                if (isCreate || missingImage) {
                    if (!state.heading.trim() || !state.paragraph.trim()) {
                        throw new Error(`Item ${index}: heading and paragraph are required.`);
                    }
                    if (!state.imageFile && missingImage) {
                        throw new Error(`Item ${index}: an image is required.`);
                    }
                    itemsToSave.push(key);
                } else if (headingChanged || paragraphChanged || imageChanged) {
                    itemsToSave.push(key);
                }
            }

            if (itemsToSave.length === 0) {
                throw new Error("No changes to save.");
            }

            // Mark pending items as waiting
            setItemStatuses((prev) => {
                const next = { ...prev };
                for (const k of itemsToSave) {
                    next[k] = { status: "waiting" };
                }
                return next;
            });

            const savedItems: string[] = [];

            // Upload items sequentially — one request per item
            for (const key of itemsToSave) {
                const num = key.replace("item", "");
                const state = forms[key];

                setItemStatuses((prev) => ({
                    ...prev,
                    [key]: { status: "uploading" },
                }));

                const itemFormData = new FormData();
                if (state.heading.trim()) {
                    itemFormData.append("heading", state.heading.trim());
                }
                if (state.paragraph.trim()) {
                    itemFormData.append("paragraph", state.paragraph.trim());
                }
                if (state.imageFile) {
                    const webpFile = await convertImageToWebp(state.imageFile);
                    itemFormData.append("image", webpFile);
                }

                try {
                    await axios.post(
                        `/api/control-panel/page/home/layer3/item/${num}`,
                        itemFormData
                    );

                    savedItems.push(`Item ${num}`);

                    // Mark this item as saved
                    setItemStatuses((prev) => ({
                        ...prev,
                        [key]: { status: "success" },
                    }));

                    // Clear local file so it is not re-uploaded on retry
                    setForms((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], imageFile: null },
                    }));
                } catch (err: unknown) {
                    const message = axios.isAxiosError(err)
                        ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
                        : (err instanceof Error ? err.message : "Upload failed.");

                    // Mark this item as error
                    setItemStatuses((prev) => ({
                        ...prev,
                        [key]: { status: "error", message },
                    }));

                    // Revert remaining unstarted items to idle
                    const remaining = itemsToSave.slice(itemsToSave.indexOf(key) + 1);
                    setItemStatuses((prev) => {
                        const next = { ...prev };
                        for (const r of remaining) {
                            next[r] = { status: "idle" };
                        }
                        return next;
                    });

                    const savedSummary =
                        savedItems.length > 0
                            ? ` (${savedItems.join(", ")} saved successfully).`
                            : "";

                    throw new Error(
                        `Item ${num} failed to save: ${message}.${savedSummary} Remaining items were not uploaded.`
                    );
                }
            }

            return savedItems;
        },
        onSuccess: (savedItems) => {
            setSuccess(
                savedItems.length === 1
                    ? `${savedItems[0]} saved successfully.`
                    : `All ${savedItems.length} items saved successfully.`
            );
            setError(null);
            hasInitializedRef.current = false;
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: HOME_LAYER3_QUERY_KEY });
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Save failed.");
            setSuccess(null);
        },
    });

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {ITEM_KEYS.map((key, i) => (
                    <ItemEditor
                        key={key}
                        label={`Item ${i + 1}`}
                        state={forms[key]}
                        existingImage={content?.[key]?.image}
                        status={itemStatuses[key]?.status}
                        statusMessage={itemStatuses[key]?.message}
                        onChange={(patch) => updateItem(key, patch)}
                        onSave={() => handleSaveSingleItem(key)}
                        isSaving={savingItemKey === key}
                    />
                ))}
            </div>

            <div className="flex items-center gap-4 pt-2">
                <Button
                    type="submit"
                    disabled={mutation.isPending || !!savingItemKey}
                    variant="outline"
                    size="sm"
                >
                    {mutation.isPending ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
                    {mutation.isPending
                        ? "Saving All Items…"
                        : "Save All Changed Items"}
                </Button>
            </div>
        </form>
    );
}