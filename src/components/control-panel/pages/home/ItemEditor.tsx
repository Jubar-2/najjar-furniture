"use client";

import Image from "next/image";
import { Upload } from "lucide-react";

export interface ItemFormState {
    heading: string;
    paragraph: string;
    imageFile: File | null;
}

export default function ItemEditor({
    label,
    state,
    existingImage,
    onChange,
}: {
    label: string;
    state: ItemFormState;
    existingImage?: string;
    onChange: (patch: Partial<ItemFormState>) => void;
}) {
    return (
        <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
            <p className="text-xs font-semibold text-neutral-500">{label}</p>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-50">
                {state.imageFile ? (
                    <Image src={URL.createObjectURL(state.imageFile)} alt="" fill className="object-cover" />
                ) : existingImage ? (
                    <Image src={existingImage} alt="" fill className="object-cover" />
                ) : (
                    <p className="flex h-full items-center justify-center text-xs text-neutral-400">
                        No image
                    </p>
                )}
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs text-neutral-600 hover:border-neutral-400">
                <Upload className="size-3.5" />
                {state.imageFile ? state.imageFile.name : "Replace image"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange({ imageFile: e.target.files?.[0] ?? null })}
                />
            </label>

            <input
                value={state.heading}
                onChange={(e) => onChange({ heading: e.target.value })}
                placeholder="Heading"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />

            <textarea
                value={state.paragraph}
                onChange={(e) => onChange({ paragraph: e.target.value })}
                placeholder="Paragraph"
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
        </div>
    );
}