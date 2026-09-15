"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContactSection } from "@/schemas/contact.schema";
import { TOPIC_ICON_OPTIONS } from "@/lib/contact";
import SectionCard from "./SectionCard";

export default function TopicsFields({ form }: { form: UseFormReturn<ContactSection> }) {
    const { control, register } = form;
    const topics = useFieldArray({ control, name: "topics" });

    return (
        <SectionCard
            title="Form Topics"
            description="Subjects customers can pick in the contact form — add or remove as needed."
        >
            <div className="space-y-3">
                {topics.fields.map((field, i) => (
                    <div key={field.id} className="flex flex-wrap items-center gap-2">
                        <select
                            {...register(`topics.${i}.icon` as const)}
                            className="h-8 w-36 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring"
                        >
                            {TOPIC_ICON_OPTIONS.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <Input {...register(`topics.${i}.label` as const)} placeholder="Topic label" className="w-80" />
                        <Button type="button" variant="outline" size="icon" onClick={() => topics.remove(i)}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => topics.append({ label: "", icon: "comment" })}>
                <Plus className="size-3.5 mr-1" />
                Add topic
            </Button>
        </SectionCard>
    );
}