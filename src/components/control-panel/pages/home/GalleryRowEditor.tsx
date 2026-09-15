"use client";

import Image from "next/image";
import { Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GalleryImage } from "@/customHooks/getGallery";

export type Row = "images" | "imagesSub";

export default function GalleryRowEditor({
    title,
    images,
    isUploading,
    inputRef,
    onUpload,
    onRequestDelete,
}: {
    title: string;
    row: Row;
    images: GalleryImage[];
    isUploading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (files: FileList | null) => void;
    onRequestDelete: (image: GalleryImage) => void;
}) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                    {title} <span className="font-normal text-neutral-400">({images.length})</span>
                </h3>

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <ImagePlus className="size-4" />
                    )}
                    Add Images
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {images.map((image) => (
                    <Card key={image.publicId} className="group relative aspect-square overflow-hidden p-0">
                        <Image src={image.url} alt="" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => onRequestDelete(image)}
                            aria-label="Delete image"
                            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    </Card>
                ))}

                {images.length === 0 && (
                    <p className="col-span-full py-6 text-center text-xs text-neutral-400">
                        No images yet.
                    </p>
                )}
            </div>
        </div>
    );
}