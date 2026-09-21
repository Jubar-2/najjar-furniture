"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertImageToWebp } from "@/lib/clientImageToWebp";

export type ItemUploadStatus = "idle" | "waiting" | "uploading" | "success" | "error";

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
    status = "idle",
    statusMessage,
    onSave,
    isSaving = false,
}: {
    label: string;
    state: ItemFormState;
    existingImage?: string;
    onChange: (patch: Partial<ItemFormState>) => void;
    status?: ItemUploadStatus;
    statusMessage?: string;
    onSave?: () => void;
    isSaving?: boolean;
}) {
    const [isConverting, setIsConverting] = useState(false);
    return (
        <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-500">{label}</p>
                {status !== "idle" && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${status === "uploading"
                            ? "bg-amber-100 text-amber-800"
                            : status === "waiting"
                                ? "bg-neutral-100 text-neutral-600"
                                : status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        title={statusMessage}
                    >
                        {status === "uploading" && <Loader2 className="size-3 animate-spin" />}
                        {status === "success" && <Check className="size-3" />}
                        {status === "error" && <AlertCircle className="size-3" />}
                        {status === "waiting" && "Waiting..."}
                        {status === "uploading" && "Uploading..."}
                        {status === "success" && "Saved"}
                        {status === "error" && "Failed"}
                    </span>
                )}
            </div>
            {status === "error" && statusMessage && (
                <p className="text-xs text-red-600">{statusMessage}</p>
            )}

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
                {isConverting ? (
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                ) : (
                    <Upload className="size-3.5" />
                )}
                {isConverting
                    ? "Converting to WebP…"
                    : state.imageFile
                    ? state.imageFile.name
                    : "Replace image"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isConverting}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                            onChange({ imageFile: null });
                            return;
                        }
                        setIsConverting(true);
                        try {
                            const webpFile = await convertImageToWebp(file);
                            onChange({ imageFile: webpFile });
                        } finally {
                            setIsConverting(false);
                        }
                    }}
                />
            </label>

            <input
                value={state.heading}
                onChange={(e) => onChange({ heading: e.target.value })}
                placeholder="Heading"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
            />

            <textarea
                value={state.paragraph}
                onChange={(e) => onChange({ paragraph: e.target.value })}
                placeholder="Paragraph"
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
            />

            {onSave && (
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    size="sm"
                    className="w-full mt-1 font-medium"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="size-3.5 animate-spin mr-1.5" />
                            Saving...
                        </>
                    ) : (
                        `Save ${label}`
                    )}
                </Button>
            )}
        </div>
    );
}