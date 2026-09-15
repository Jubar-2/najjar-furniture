"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { PortfolioItem } from "@/customHooks/usePortfolioItems";
import PortfolioItemFormBody from "./PortfolioItemFormBody";

interface FormDialogProps {
    open: boolean;
    editing: PortfolioItem | null;
    onOpenChange: (open: boolean) => void;
}

export default function PortfolioItemFormDialog({ open, editing, onOpenChange }: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {open && (
                    <PortfolioItemFormBody
                        key={editing?._id ?? "new"}
                        editing={editing}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}