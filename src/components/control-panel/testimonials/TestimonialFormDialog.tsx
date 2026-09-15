"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Testimonial } from "@/customHooks/useTestimonials";
import TestimonialFormBody from "./TestimonialFormBody";

interface FormDialogProps {
    open: boolean;
    editing: Testimonial | null;
    onOpenChange: (open: boolean) => void;
}

export default function TestimonialFormDialog({ open, editing, onOpenChange }: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {open && (
                    <TestimonialFormBody
                        key={editing?._id ?? "new"}
                        editing={editing}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}