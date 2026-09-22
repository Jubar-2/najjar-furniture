"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import { useGetBanner, useUpdateBanner } from "@/customHooks/getBanner";
import { useGetContact } from "@/customHooks/useContact";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcons";

import { convertImageToWebp } from "@/lib/clientImageToWebp";

function Banner() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { data, isLoading } = useGetBanner();
    const { data: contactData } = useGetContact();
    const { mutate, isPending } = useUpdateBanner();

    const [heading, setHeading] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [whatsAppNumber, setWhatsAppNumber] = useState("");
    const [ctaLabel, setCtaLabel] = useState("Chat on WhatsApp");
    const [showWhatsApp, setShowWhatsApp] = useState(true);
    const [showSocials, setShowSocials] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (data && !hasInitializedRef.current) {
            setHeading(data.heading ?? "");
            setParagraph(data.paragraph ?? "");
            setWhatsAppNumber(data.whatsAppNumber ?? "");
            setCtaLabel(data.ctaLabel || "Chat on WhatsApp");
            setShowWhatsApp(data.showWhatsApp !== false);
            setShowSocials(data.showSocials !== false);
            hasInitializedRef.current = true;
        }
    }, [data]);

    const primaryContactWhatsApp = contactData?.whatsapps?.[0]?.value || "+880 1XXX-XXXXXX";
    const effectiveWhatsAppNumber = whatsAppNumber.trim() || primaryContactWhatsApp;
    const effectiveCtaLabel = ctaLabel.trim() || "Chat on WhatsApp";

    async function handleClick() {
        setError(null);
        setSuccess(false);

        const form = new FormData();
        form.append("paragraph", paragraph);
        form.append("heading", heading);
        form.append("whatsAppNumber", whatsAppNumber.trim());
        form.append("ctaLabel", effectiveCtaLabel);
        form.append("showWhatsApp", String(showWhatsApp));
        form.append("showSocials", String(showSocials));

        if (file) {
            const webpFile = await convertImageToWebp(file);
            form.append("banner", webpFile);
        }

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
    const previewSocials = contactData?.socials?.length
        ? contactData.socials
        : [
            { name: "facebook", url: "https://facebook.com" },
            { name: "instagram", url: "https://instagram.com" },
            { name: "youtube", url: "https://youtube.com" },
        ];

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[460px_1fr] items-start max-w-6xl">
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

                {/* WhatsApp & Social Media Controls */}
                <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 space-y-3.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
                            Hero WhatsApp & Socials
                        </span>
                        <span className="text-[11px] text-amber-700 font-medium">Hero Action Controls</span>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="banner-whatsapp">Hero WhatsApp Number</FieldLabel>
                        <Input
                            id="banner-whatsapp"
                            value={whatsAppNumber}
                            onChange={(e) => {
                                setWhatsAppNumber(e.target.value);
                                setSuccess(false);
                            }}
                            placeholder={primaryContactWhatsApp ? `Default: ${primaryContactWhatsApp}` : "+880 1712-345678"}
                            className="bg-white"
                        />
                        <p className="text-[11px] text-neutral-500 mt-1">
                            Specific WhatsApp number for the hero button. Leave blank to use primary number from Contact Settings ({primaryContactWhatsApp}).
                        </p>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="banner-cta-label">WhatsApp Button Text</FieldLabel>
                        <Input
                            id="banner-cta-label"
                            value={ctaLabel}
                            onChange={(e) => {
                                setCtaLabel(e.target.value);
                                setSuccess(false);
                            }}
                            placeholder="Chat on WhatsApp"
                            className="bg-white"
                        />
                    </Field>

                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={showWhatsApp}
                                onChange={(e) => {
                                    setShowWhatsApp(e.target.checked);
                                    setSuccess(false);
                                }}
                                className="size-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                            />
                            Show WhatsApp button
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={showSocials}
                                onChange={(e) => {
                                    setShowSocials(e.target.checked);
                                    setSuccess(false);
                                }}
                                className="size-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                            />
                            Show social icons in hero
                        </label>
                    </div>
                </div>

                <Button onClick={handleClick} disabled={isPending} className="mt-1 w-full sm:w-auto">
                    {isPending && <Loader2 className="size-4 mr-1.5 animate-spin" />}
                    Update Banner
                </Button>
            </div>

            {/* Live Hero Preview */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Hero Section Live Preview
                    </p>
                    <span className="text-[11px] text-amber-700">Updates live as you type</span>
                </div>

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

                    <div className="relative z-10 max-w-md space-y-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                            Hero Preview
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-[#f2ead9] leading-tight font-serif">
                            {heading || "Crafted by Nature. Designed for Life."}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/85 line-clamp-3 leading-relaxed">
                            {paragraph || "Every piece is thoughtfully designed and expertly handcrafted to combine natural beauty, lasting durability, and refined elegance."}
                        </p>

                        {/* Actions preview in Hero */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            {showWhatsApp && (
                                <div className="inline-flex items-center gap-2 bg-[#EFD5AB] px-3.5 py-1.5 rounded-sm shadow-xs text-[#4a2f1c]">
                                    <SocialIcon platform="whatsapp" size={16} className="text-[#4a2f1c]" />
                                    <span className="font-serif text-xs font-semibold">{effectiveCtaLabel}</span>
                                    <ArrowRight className="size-3 text-[#4a2f1c]" />
                                </div>
                            )}

                            {showSocials && (
                                <div className="flex items-center gap-1.5">
                                    {previewSocials.slice(0, 4).map((s, idx) => (
                                        <div
                                            key={s.name || idx}
                                            className="size-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[#f2ead9]"
                                            title={s.name}
                                        >
                                            <SocialIcon platform={s.name} size={13} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {showWhatsApp && (
                            <p className="text-[10px] text-amber-200/80 tracking-wide">
                                WhatsApp target: <span className="font-mono text-white">{effectiveWhatsAppNumber}</span>
                            </p>
                        )}
                    </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                    Shows the loaded banner, WhatsApp chat trigger, and dynamic social media links as they appear on the homepage.
                </p>
            </div>
        </div>
    );
}

export default Banner;