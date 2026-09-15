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
    const [error, setError] = useState<string | null>(null);

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

            <div className="space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Title</span>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Walnut Dining Table" />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Category</span>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Living Room" />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Description</span>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe this piece..."
                        rows={4}
                    />
                </label>

                <div className="w-full">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Image</span>
                    <ImageUpload
                        value={editing?.image}
                        aspect="square"
                        onChange={(file) => setImageFile(file)}
                    />
                </div>
            </div>

            <DialogFooter>
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