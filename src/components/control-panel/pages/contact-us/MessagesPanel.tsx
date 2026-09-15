"use client";

import { useState } from "react";
import { Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { ContactMessageStatus } from "@/schemas/contact.schema";
import {
    useGetContactMessages,
    useDeleteContactMessage,
    useUpdateContactMessageStatus,
    type ContactMessage,
} from "@/customHooks/useContact";

const STATUS_STYLES: Record<ContactMessageStatus, string> = {
    new: "border-blue-200 bg-blue-50 text-blue-700",
    read: "border-amber-200 bg-amber-50 text-amber-700",
    resolved: "border-green-200 bg-green-50 text-green-700",
};

export default function MessagesPanel() {
    const { data: messages, isLoading } = useGetContactMessages();
    const updateMutation = useUpdateContactMessageStatus();
    const deleteMutation = useDeleteContactMessage();

    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = async (message: ContactMessage, status: ContactMessageStatus) => {
        setError(null);
        try {
            await updateMutation.mutateAsync({ id: message._id, status });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed.");
        }
    };

    const handleDelete = async (id: string) => {
        setError(null);
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-neutral-500">
                Messages submitted through the public contact form. Status defaults to New.
            </p>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : messages && messages.length > 0 ? (
                <div className="space-y-3">
                    {messages.map((m) => (
                        <Card key={m._id} className="p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                                <a
                                    href={`mailto:${m.email}`}
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                >
                                    <Mail className="size-3" />
                                    {m.email}
                                </a>
                                <Badge variant="outline" className="bg-neutral-50 text-neutral-600">
                                    {m.topic}
                                </Badge>
                                <Badge className={cn("capitalize", STATUS_STYLES[m.status])}>
                                    {m.status}
                                </Badge>
                                {m.createdAt && (
                                    <span className="ml-auto text-[11px] text-neutral-400">
                                        {new Date(m.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>

                            <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">{m.message}</p>

                            <div className="mt-3 flex items-center justify-end gap-2">
                                <select
                                    value={m.status}
                                    onChange={(e) => handleStatusChange(m, e.target.value as ContactMessageStatus)}
                                    disabled={updateMutation.isPending}
                                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring"
                                >
                                    <option value="new">New</option>
                                    <option value="read">Read</option>
                                    <option value="resolved">Resolved</option>
                                </select>

                                <AlertDialog>
                                    <AlertDialogTrigger
                                        render={
                                            <Button type="button" variant="destructive" size="sm">
                                                <Trash2 className="size-3.5 mr-1" />
                                                Delete
                                            </Button>
                                        }
                                    />
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete message?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove the message from {m.name}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(m._id)}>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 py-12 text-center">
                    <Mail className="size-5 text-neutral-300" />
                    <p className="text-sm text-neutral-500">No messages yet.</p>
                </div>
            )}
        </div>
    );
}