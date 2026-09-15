"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ItemEditor, { type ItemFormState } from "./ItemEditor";

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────
    const { data: content, isLoading } = useQuery<Content | null>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await fetch("/api/control-panel/page/home/layer3");
            if (res.status === 404) return null; // section doesn't exist yet
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error ?? "Failed to load.");
            }
            const json = await res.json();
            const c: Content = json.data.content;
            // Sync text form fields when data arrives
            setForms(
                Object.fromEntries(
                    ITEM_KEYS.map((k) => [
                        k,
                        { heading: c[k]?.heading ?? "", paragraph: c[k]?.paragraph ?? "", imageFile: null },
                    ])
                )
            );
            return c;
        },
    });

    function updateItem(key: string, patch: Partial<ItemFormState>) {
        setForms((f) => ({ ...f, [key]: { ...f[key], ...patch } }));
    }

    // The backend's item schema requires heading + paragraph + image
    // together whenever an item is included at all — it doesn't support
    // changing just one field within an item. So if the admin edited an
    // item's text but didn't pick a new file, we fetch the *existing*
    // remote image and convert it back into a File, so that item still
    // validates as "complete" without forcing a re-upload every time.
    async function resolveImageFile(key: string): Promise<File | null> {
        const state = forms[key];
        if (state.imageFile) return state.imageFile;

        const existingUrl = content?.[key as keyof Content]?.image;
        if (!existingUrl) return null;

        const res = await fetch(existingUrl);
        const blob = await res.blob();
        return new File([blob], `${key}.jpg`, { type: blob.type });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        mutation.mutate();
    }

    // ── Save ───────────────────────────────────────────────────────────────
    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            const isCreate = !content;

            for (const key of ITEM_KEYS) {
                const index = key.replace("item", "");
                const state = forms[key];
                const existing = content?.[key as keyof Content];

                const headingChanged = state.heading !== (existing?.heading ?? "");
                const paragraphChanged = state.paragraph !== (existing?.paragraph ?? "");
                const imageChanged = !!state.imageFile;

                // On create, every item must be sent regardless of "changed".
                // On update, only send items that were actually touched.
                if (!isCreate && !headingChanged && !paragraphChanged && !imageChanged) {
                    continue;
                }

                if (!state.heading || !state.paragraph) {
                    throw new Error(`Item ${index}: heading and paragraph are required.`);
                }

                const imageFile = await resolveImageFile(key);
                if (!imageFile) {
                    throw new Error(`Item ${index}: an image is required.`);
                }

                formData.append(`heading${index}`, state.heading);
                formData.append(`paragraph${index}`, state.paragraph);
                formData.append(`image${index}`, imageFile);
            }

            const method = isCreate ? "POST" : "PATCH";
            const res = await fetch("/api/control-panel/page/home/layer3", { method, body: formData });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Save failed.");
            return json;
        },
        onSuccess: () => {
            setSuccess(true);
            setError(null);
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
        <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {ITEM_KEYS.map((key, i) => (
                    <ItemEditor
                        key={key}
                        label={`Item ${i + 1}`}
                        state={forms[key]}
                        existingImage={content?.[key]?.image}
                        onChange={(patch) => updateItem(key, patch)}
                    />
                ))}
            </div>

            <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {content ? "Save Changes" : "Create Layer 3"}
            </Button>
        </form>
    );
}