"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
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
import {
    useDeletePortfolioItem,
    useGetPortfolioItems,
} from "@/customHooks/usePortfolioItems";
import type { PortfolioItem } from "@/customHooks/usePortfolioItems";
import PortfolioItemFormDialog from "./PortfolioItemFormDialog";

export default function PortfolioItemsAdmin() {
    const { data: items, isLoading } = useGetPortfolioItems();
    const deleteMutation = useDeletePortfolioItem();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<PortfolioItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (item: PortfolioItem) => {
        setEditing(item);
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
                <h1 className="text-lg font-semibold text-slate-800">Portfolio</h1>
                <Button type="button" onClick={openCreate}>
                    <Plus className="size-4 mr-1" />
                    Add Portfolio Item
                </Button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : items && items.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item._id} className="flex flex-col gap-3 p-4">
                            <div className="relative aspect-video overflow-hidden rounded-xl">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                                {item.category && (
                                    <p className="truncate text-xs text-neutral-500">{item.category}</p>
                                )}
                            </div>

                            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
                                {item.description.replace(/<[^>]*>/g, "")}
                            </p>

                            <div className="mt-auto flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>
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
                                            <AlertDialogTitle>Delete portfolio item?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove &quot;{item.title}&quot;.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(item._id)}>
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
                <p className="text-sm text-neutral-500">No portfolio items yet. Add your first one.</p>
            )}

            <PortfolioItemFormDialog open={dialogOpen} editing={editing} onOpenChange={setDialogOpen} />
        </div>
    );
}