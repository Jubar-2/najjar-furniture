"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactSection } from "@/schemas/contact.schema";
import SectionCard from "./SectionCard";
import TextField from "./TextField";
import {
    SocialIcon,
    SOCIAL_PLATFORM_LIST,
    PLATFORM_CONFIGS,
    normalizePlatformKey,
} from "@/components/ui/SocialIcons";

export default function ContactInfoFields({ form }: { form: UseFormReturn<ContactSection> }) {
    const { control, register, watch, setValue } = form;

    const emails = useFieldArray({ control, name: "emails" });
    const phones = useFieldArray({ control, name: "phones" });
    const whatsapps = useFieldArray({ control, name: "whatsapps" });
    const socials = useFieldArray({ control, name: "socials" });
    const responseTimes = useFieldArray({ control, name: "responseTimes" });

    const watchedSocials = watch("socials") || [];

    // Check which popular platforms are already in use
    const usedPlatforms = new Set(
        (watchedSocials || []).map((s) => normalizePlatformKey(s?.name))
    );

    const quickAddPlatforms = SOCIAL_PLATFORM_LIST.filter(
        (p) => p.key !== "website" && !usedPlatforms.has(p.key)
    );

    const handleSelectPlatform = (index: number, newPlatformKey: string) => {
        const config = PLATFORM_CONFIGS[newPlatformKey];
        setValue(`socials.${index}.name`, newPlatformKey, { shouldDirty: true });

        const currentUrl = watchedSocials[index]?.url || "";
        if (!currentUrl && config) {
            setValue(`socials.${index}.url`, config.defaultPrefix, { shouldDirty: true });
        }
    };

    const handleQuickAdd = (platformKey: string) => {
        const config = PLATFORM_CONFIGS[platformKey];
        socials.append({
            name: platformKey,
            url: config?.defaultPrefix || "https://",
        });
    };

    return (
        <div className="space-y-6">
            <SectionCard title="Emails" description="Two email addresses shown on the contact page.">
                {emails.fields.map((field, i) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2">
                        <Input {...register(`emails.${i}.label`)} placeholder="Label" className="w-36" />
                        <Input {...register(`emails.${i}.value`)} placeholder="email@example.com" className="w-72" />
                        <Button type="button" variant="outline" size="icon" onClick={() => emails.remove(i)}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => emails.append({ label: "", value: "" })}>
                    <Plus className="size-3.5 mr-1" />
                    Add email
                </Button>
            </SectionCard>

            <SectionCard title="Phone Numbers" description="Two phone numbers shown on the contact page.">
                {phones.fields.map((field, i) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2">
                        <Input {...register(`phones.${i}.label`)} placeholder="Label" className="w-36" />
                        <Input {...register(`phones.${i}.value`)} placeholder="+880 1XXX-XXXXXX" className="w-72" />
                        <Button type="button" variant="outline" size="icon" onClick={() => phones.remove(i)}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => phones.append({ label: "", value: "" })}>
                    <Plus className="size-3.5 mr-1" />
                    Add phone
                </Button>
            </SectionCard>

            <SectionCard
                title="WhatsApp Numbers"
                description="WhatsApp numbers shown on the website — tapping one opens WhatsApp click-to-chat."
            >
                {whatsapps.fields.map((field, i) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2">
                        <Input {...register(`whatsapps.${i}.label`)} placeholder="Label (e.g. Sales, Support)" className="w-44" />
                        <Input {...register(`whatsapps.${i}.value`)} placeholder="+880 1XXX-XXXXXX" className="w-72" />
                        <Button type="button" variant="outline" size="icon" onClick={() => whatsapps.remove(i)}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => whatsapps.append({ label: "Support", value: "" })}>
                    <Plus className="size-3.5 mr-1" />
                    Add WhatsApp
                </Button>
            </SectionCard>

            {/* Dynamic Social Media Section */}
            <SectionCard
                title="Social Media Channels"
                description="Dynamic social media icons and profile links shown across the website (Home Hero, Footer, Contact Us). Select a platform to automatically bind authentic brand icons."
            >
                <div className="space-y-3">
                    {socials.fields.map((field, i) => {
                        const currentName = watchedSocials[i]?.name || "";
                        const currentUrl = watchedSocials[i]?.url || "";
                        const platformKey = normalizePlatformKey(currentName);
                        const platformConfig = PLATFORM_CONFIGS[platformKey];

                        return (
                            <div
                                key={field.id}
                                className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-amber-200 transition-colors"
                            >
                                {/* Live Platform Icon Preview */}
                                <div
                                    className="size-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-2xs"
                                    title={platformConfig?.label || currentName || "Social Icon"}
                                >
                                    <SocialIcon platform={currentName} size={18} />
                                </div>

                                {/* Platform Selector */}
                                <select
                                    value={platformKey}
                                    onChange={(e) => handleSelectPlatform(i, e.target.value)}
                                    className="h-9 px-3 py-1 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-36 sm:w-40"
                                >
                                    {SOCIAL_PLATFORM_LIST.map((p) => (
                                        <option key={p.key} value={p.key}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Custom name input if needed */}
                                {platformKey === "website" && (
                                    <Input
                                        {...register(`socials.${i}.name`)}
                                        placeholder="Platform Name"
                                        className="w-32 bg-white"
                                    />
                                )}

                                {/* URL Input */}
                                <div className="flex-1 min-w-[200px]">
                                    <Input
                                        {...register(`socials.${i}.url`)}
                                        placeholder={platformConfig?.placeholder || "https://..."}
                                        className="bg-white font-mono text-xs sm:text-sm"
                                    />
                                </div>

                                {/* Test Link action */}
                                {currentUrl && (
                                    <a
                                        href={currentUrl.startsWith("http") || currentUrl.startsWith("//") ? currentUrl : `https://${currentUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Test this link in a new tab"
                                        className="size-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-amber-700 hover:border-amber-300 transition-colors shadow-2xs"
                                    >
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                )}

                                {/* Delete action */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    title="Remove this social channel"
                                    onClick={() => socials.remove(i)}
                                    className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Add Presets */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Quick Add:</span>
                    {quickAddPlatforms.slice(0, 6).map((platform) => (
                        <button
                            key={platform.key}
                            type="button"
                            onClick={() => handleQuickAdd(platform.key)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-all cursor-pointer shadow-2xs"
                        >
                            <SocialIcon platform={platform.key} size={13} />
                            <span>+{platform.label}</span>
                        </button>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => socials.append({ name: "facebook", url: "https://facebook.com/" })}
                        className="ml-auto"
                    >
                        <Plus className="size-3.5 mr-1" />
                        Add Channel
                    </Button>
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SectionCard title="Address">
                    <TextField form={form} name="address" />
                </SectionCard>
                <SectionCard title="Showroom Hours">
                    <TextField form={form} name="showroomHours" />
                </SectionCard>
            </div>

            <SectionCard title="Response Times">
                <div className="space-y-3">
                    {responseTimes.fields.map((field, i) => (
                        <div key={field.id} className="flex flex-wrap items-center gap-2">
                            <Input {...register(`responseTimes.${i}.channel`)} placeholder="Channel" className="w-44" />
                            <Input {...register(`responseTimes.${i}.time`)} placeholder="e.g. 1–2 days" className="w-56" />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => responseTimes.remove(i)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => responseTimes.append({ channel: "", time: "" })}
                >
                    <Plus className="size-3.5 mr-1" />
                    Add
                </Button>
            </SectionCard>

            <SectionCard
                title="CTA Banner"
                description="The bottom call-to-action strip on the contact page."
            >
                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Title</span>
                    <Input {...register("cta.title")} />
                </label>
                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Subtitle</span>
                    <Input {...register("cta.subtitle")} />
                </label>
                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Description</span>
                    <Textarea {...register("cta.description")} rows={3} />
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-neutral-500">Button label</span>
                        <Input {...register("cta.ctaLabel")} />
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-neutral-500">Button link</span>
                        <Input {...register("cta.ctaHref")} />
                    </label>
                </div>
            </SectionCard>
        </div>
    );
}