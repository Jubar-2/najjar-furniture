"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import {
    useCreatePortfolioItem,
    useUpdatePortfolioItem,
} from "@/customHooks/usePortfolioItems";
import type { PortfolioItem } from "@/customHooks/usePortfolioItems";

interface SubImageSlotState {
    file: File | null;
    url: string | null;
}

function getInitialSubImages(editing: PortfolioItem | null): SubImageSlotState[] {
    const arr: SubImageSlotState[] = [
        { file: null, url: null },
        { file: null, url: null },
        { file: null, url: null },
    ];
    if (editing?.subImages && Array.isArray(editing.subImages)) {
        editing.subImages.slice(0, 3).forEach((sub, i) => {
            const url = typeof sub === "string" ? sub : sub?.url || null;
            arr[i] = { file: null, url };
        });
    }
    return arr;
}

export default function PortfolioItemFormBody({
    editing,
    onClose,
}: {
    editing: PortfolioItem | null;
    onClose: () => void;
}) {
    const createMutation = useCreatePortfolioItem();
    const updateMutation = useUpdatePortfolioItem();

    const [title, setTitle] = useState(editing?.title ?? "");
    const [category, setCategory] = useState(editing?.category ?? "");
    const [description, setDescription] = useState(editing?.description ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [subImageSlots, setSubImageSlots] = useState<SubImageSlotState[]>(() =>
        getInitialSubImages(editing)
    );
    const [error, setError] = useState<string | null>(null);

    const handleSubImageChange = (
        index: number,
        file: File | null,
        previewUrl: string | null
    ) => {
        setSubImageSlots((prev) => {
            const next = [...prev];
            next[index] = { file, url: previewUrl };
            return next;
        });
    };

    const handleSubmit = async () => {
        setError(null);
        try {
            if (!title.trim()) throw new Error("Title is required.");
            if (!description.trim()) throw new Error("Description is required.");

            const formData = new FormData();
            formData.append("title", title.trim());
            if (category.trim()) formData.append("category", category.trim());
            formData.append("description", description.trim());
            if (imageFile) formData.append("image", imageFile);

            // Append sub-images
            formData.append("hasSubImages", "true");
            subImageSlots.forEach((slot, i) => {
                if (slot.file) {
                    formData.append(`subImage_${i}`, slot.file);
                } else if (slot.url && !slot.url.startsWith("blob:")) {
                    formData.append(`subImage_${i}_url`, slot.url);
                }
            });

            if (editing) {
                await updateMutation.mutateAsync({ id: editing._id, formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <>
            <DialogHeader>
                <DialogTitle>{editing ? "Edit Portfolio Item" : "Add Portfolio Item"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Title</span>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Walnut Dining Table"
                    />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Category</span>
                    <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Living Room"
                    />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Description</span>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe this piece..."
                        rows={3}
                    />
                </label>

                {/* Primary Hero Image */}
                <div className="w-full">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Main Image <span className="text-neutral-400 font-normal">(Hero image for card)</span>
                    </span>
                    <ImageUpload
                        value={editing?.image}
                        aspect="video"
                        onChange={(file) => setImageFile(file)}
                    />
                </div>

                {/* Sub Images (Up to 3 detail photos) */}
                <div className="w-full pt-3 border-t border-neutral-200/80 space-y-2">
                    <div>
                        <span className="block text-xs font-semibold text-neutral-800">
                            Sub Images <span className="text-neutral-500 font-normal">(Up to 3 detail photos)</span>
                        </span>
                        <p className="text-[11px] text-neutral-500">
                            These 3 thumbnails appear directly below the main image on the portfolio card.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {subImageSlots.map((slot, index) => (
                            <div key={index} className="space-y-1">
                                <span className="text-[11px] font-medium text-neutral-500">
                                    Sub Image {index + 1}
                                </span>
                                <ImageUpload
                                    value={slot.url ?? undefined}
                                    aspect="video"
                                    onChange={(file, previewUrl) =>
                                        handleSubImageChange(index, file, previewUrl)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DialogFooter className="pt-2 border-t border-neutral-100">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    {editing ? "Save Changes" : "Add Portfolio Item"}
                </Button>
            </DialogFooter>
        </>
    );
}