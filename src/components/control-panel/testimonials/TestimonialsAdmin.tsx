"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useDeleteTestimonial, useGetTestimonials } from "@/customHooks/useTestimonials";
import type { Testimonial } from "@/customHooks/useTestimonials";
import TestimonialFormDialog from "./TestimonialFormDialog";

export default function TestimonialsAdmin() {
    const { data: testimonials, isLoading } = useGetTestimonials();
    const deleteMutation = useDeleteTestimonial();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (testimonial: Testimonial) => {
        setEditing(testimonial);
        setDialogOpen(true);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-slate-800">Testimonials</h1>
                <Button type="button" onClick={openCreate}>
                    <Plus className="size-4 mr-1" />
                    Add Testimonial
                </Button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : testimonials && testimonials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((t) => (
                        <Card key={t._id} className="flex flex-col gap-3 p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10">
                                    {t.avatar && <AvatarImage src={t.avatar} alt={t.name} />}
                                    <AvatarFallback>{(t.name || "?").charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-800">{t.name || "Anonymous"}</p>
                                    {t.location && <p className="truncate text-xs text-neutral-500">{t.location}</p>}
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed text-neutral-600">{t.message}</p>

                            <div className="mt-auto flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => openEdit(t)}>
                                    <Pencil className="size-3.5 mr-1" />
                                    Edit
                                </Button>
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
                                            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove the testimonial
                                                {t.name ? ` from ${t.name}` : ""}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(t._id)}>
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
                <p className="text-sm text-neutral-500">No testimonials yet. Add your first one.</p>
            )}

            <TestimonialFormDialog open={dialogOpen} editing={editing} onOpenChange={setDialogOpen} />
        </div>
    );
}