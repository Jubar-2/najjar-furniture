"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactSection } from "@/schemas/contact.schema";
import SectionCard from "./SectionCard";
import TextField from "./TextField";

export default function ContactInfoFields({ form }: { form: UseFormReturn<ContactSection> }) {
    const { control, register } = form;

    const emails = useFieldArray({ control, name: "emails" });
    const phones = useFieldArray({ control, name: "phones" });
    const whatsapps = useFieldArray({ control, name: "whatsapps" });
    const socials = useFieldArray({ control, name: "socials" });
    const responseTimes = useFieldArray({ control, name: "responseTimes" });

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

            <SectionCard title="WhatsApp Numbers" description="Two WhatsApp numbers — tapping one opens a chat.">
                {whatsapps.fields.map((field, i) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2">
                        <Input {...register(`whatsapps.${i}.label`)} placeholder="Label" className="w-36" />
                        <Input {...register(`whatsapps.${i}.value`)} placeholder="+880 1XXX-XXXXXX" className="w-72" />
                        <Button type="button" variant="outline" size="icon" onClick={() => whatsapps.remove(i)}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => whatsapps.append({ label: "", value: "" })}>
                    <Plus className="size-3.5 mr-1" />
                    Add WhatsApp
                </Button>
            </SectionCard>

            <SectionCard title="Social Media" description="All social channels. Name like facebook / instagram / youtube — icon is matched automatically.">
                <div className="space-y-3">
                    {socials.fields.map((field, i) => (
                        <div key={field.id} className="flex flex-wrap items-center gap-2">
                            <Input {...register(`socials.${i}.name`)} placeholder="facebook" className="w-40" />
                            <Input
                                {...register(`socials.${i}.url`)}
                                placeholder="https://facebook.com/..."
                                className="w-80"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => socials.remove(i)}>
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
                    onClick={() => socials.append({ name: "", url: "" })}
                >
                    <Plus className="size-3.5 mr-1" />
                    Add social
                </Button>
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