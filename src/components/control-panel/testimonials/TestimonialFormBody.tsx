"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/control-panel/pages/ImageUpload";
import {
    useCreateTestimonial,
    useUpdateTestimonial,
} from "@/customHooks/useTestimonials";
import type { Testimonial } from "@/customHooks/useTestimonials";

export default function TestimonialFormBody({
    editing,
    onClose,
}: {
    editing: Testimonial | null;
    onClose: () => void;
}) {
    const createMutation = useCreateTestimonial();
    const updateMutation = useUpdateTestimonial();

    const [name, setName] = useState(editing?.name ?? "");
    const [location, setLocation] = useState(editing?.location ?? "");
    const [message, setMessage] = useState(editing?.message ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            if (!name.trim()) throw new Error("Name is required.");
            if (!message.trim()) throw new Error("Message is required.");

            const formData = new FormData();
            formData.append("name", name.trim());
            if (location.trim()) formData.append("location", location.trim());
            formData.append("message", message.trim());
            if (avatarFile) formData.append("avatar", avatarFile);

            if (editing) {
                await updateMutation.mutateAsync({ id: editing._id, formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <>
            <DialogHeader>
                <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Name</span>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Location</span>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Message</span>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Customer testimonial"
                        rows={4}
                    />
                </label>

                <div className="w-full">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-500">Avatar</span>
                    <ImageUpload
                        value={editing?.avatar}
                        aspect="square"
                        onChange={(file) => setAvatarFile(file)}
                    />
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    {editing ? "Save Changes" : "Add Testimonial"}
                </Button>
            </DialogFooter>
        </>
    );
}