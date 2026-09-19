"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import { useGetBanner, useUpdateBanner } from "@/customHooks/getBanner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Banner() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { data, isLoading } = useGetBanner();
    const { mutate, isPending } = useUpdateBanner();

    const [heading, setHeading] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (data && !hasInitializedRef.current) {
            setHeading(data.heading ?? "");
            setParagraph(data.paragraph ?? "");
            hasInitializedRef.current = true;
        }
    }, [data]);

    function handleClick() {
        setError(null);
        setSuccess(false);

        const form = new FormData();
        form.append("paragraph", paragraph);
        form.append("heading", heading);
        if (file) form.append("banner", file);

        mutate(form, {
            onSuccess: () => {
                hasInitializedRef.current = false;
                setFile(null);
                setPreviewUrl(null);
                setSuccess(true);
            },
            onError: (err) => {
                setError(err instanceof Error ? err.message : "Failed to update banner.");
                setSuccess(false);
            },
        });
    }

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    const currentBanner = previewUrl ?? data?.banner ?? null;

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[440px_1fr] items-start max-w-6xl">
            {/* Editor Form */}
            <div className="space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                        Banner updated successfully.
                    </div>
                )}

                <div>
                    <FieldLabel className="mb-2 block text-xs font-medium text-neutral-500">
                        Banner Image
                    </FieldLabel>
                    <ImageUpload
                        value={data?.banner}
                        onChange={(selectedFile, newPreviewUrl) => {
                            setFile(selectedFile);
                            setPreviewUrl(newPreviewUrl);
                            setSuccess(false);
                        }}
                        aspect="video"
                    />
                </div>

                <Field>
                    <FieldLabel htmlFor="banner-heading">Heading</FieldLabel>
                    <Textarea
                        value={heading}
                        onChange={(e) => {
                            setHeading(e.target.value);
                            setSuccess(false);
                        }}
                        id="banner-heading"
                        placeholder="Type your heading here."
                        rows={2}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="banner-paragraph">Paragraph</FieldLabel>
                    <Textarea
                        value={paragraph}
                        onChange={(e) => {
                            setParagraph(e.target.value);
                            setSuccess(false);
                        }}
                        id="banner-paragraph"
                        placeholder="Type your message here."
                        rows={4}
                    />
                </Field>

                <Button onClick={handleClick} disabled={isPending} className="mt-1">
                    {isPending && <Loader2 className="size-4 mr-1.5 animate-spin" />}
                    Update Banner
                </Button>
            </div>

            {/* Live Hero Preview */}
            <div className="space-y-2.5">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Hero Section Preview
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-[#0f0b08] shadow-md flex flex-col justify-center p-6 sm:p-8">
                    {currentBanner ? (
                        <Image
                            src={currentBanner}
                            alt="Hero Banner Preview"
                            fill
                            unoptimized
                            className="object-cover object-center pointer-events-none"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[#1c1611] flex items-center justify-center text-xs text-neutral-400">
                            No banner image loaded
                        </div>
                    )}

                    {/* Gradient overlay mirroring homepage hero */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f0b08]/95 via-[#0f0b08]/65 to-[#0f0b08]/20 pointer-events-none" />

                    <div className="relative z-10 max-w-md space-y-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                            Preview
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#f2ead9] leading-tight font-serif">
                            {heading || "Crafted by Nature. Designed for Life."}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/85 line-clamp-3 leading-relaxed">
                            {paragraph || "Every piece is thoughtfully designed and expertly handcrafted to combine natural beauty, lasting durability, and refined elegance."}
                        </p>
                    </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                    Shows the loaded banner and live text layout as it appears in the hero section on the homepage.
                </p>
            </div>
        </div>
    );
}

export default Banner;