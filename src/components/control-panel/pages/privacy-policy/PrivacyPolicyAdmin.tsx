"use client";

import { useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/control-panel/pages/TiptapEditor";
import { cn } from "@/lib/utils";
import {
    useGetPageContent,
    useSavePageContent,
} from "@/customHooks/usePageContent";

const PAGE_NAME = "privacy-policy";

export default function PrivacyPolicyAdmin() {
    const { data, isLoading } = useGetPageContent(PAGE_NAME);
    const saveMutation = useSavePageContent(PAGE_NAME);

    const editorHtml = useRef<string>("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSave = async () => {
        setMessage(null);

        const html = editorHtml.current || data?.body || "";

        if (!html.replace(/<[^>]*>/g, "").trim()) {
            setMessage({ type: "error", text: "Content is required." });
            return;
        }

        try {
            await saveMutation.mutateAsync(html);
            setMessage({ type: "success", text: "Saved." });
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold text-slate-800">Privacy Policy</h1>
                <Button type="button" onClick={handleSave} disabled={saveMutation.isPending}>
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

            {isLoading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : (
                <TiptapEditor
                    content={data?.body ?? ""}
                    onChange={(html) => {
                        editorHtml.current = html;
                    }}
                    placeholder="Write privacy policy content..."
                />
            )}
        </div>
    );
}