"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTabs from "@/components/control-panel/pages/PageTabs";
import { cn } from "@/lib/utils";
import type { ContactSection } from "@/schemas/contact.schema";
import { DEFAULT_CONTACT } from "@/lib/contact";
import { useGetContact, useSaveContact } from "@/customHooks/useContact";
import MessagesPanel from "./MessagesPanel";
import ContactInfoFields from "./ContactInfoFields";
import TopicsFields from "./TopicsFields";

export default function ContactAdmin() {
    const { data, isLoading } = useGetContact();
    const saveMutation = useSaveContact();

    const form = useForm<ContactSection>({
        defaultValues: DEFAULT_CONTACT,
        values: data ?? undefined,
    });

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const onSubmit = form.handleSubmit(async (values) => {
        setMessage(null);
        try {
            await saveMutation.mutateAsync(values);
            setMessage({ type: "success", text: "Saved." });
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
        }
    });

    if (isLoading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold text-slate-800">Contact Us</h1>
                <Button type="button" onClick={onSubmit} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? (
                        <Loader2 className="size-4 mr-1 animate-spin" />
                    ) : (
                        <Save className="size-4 mr-1" />
                    )}
                    Save
                </Button>
            </div>

            {message && (
                <div
                    className={cn(
                        "rounded-lg border px-4 py-2.5 text-sm",
                        message.type === "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700"
                    )}
                >
                    {message.text}
                </div>
            )}

            <PageTabs
                tabs={[
                    { key: "info", label: "Contact Info", content: <ContactInfoFields form={form} /> },
                    { key: "topics", label: "Topics", content: <TopicsFields form={form} /> },
                    { key: "messages", label: "Messages", content: <MessagesPanel /> },
                ]}
            />
        </div>
    );
}