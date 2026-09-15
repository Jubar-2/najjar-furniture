import type { ReactNode } from "react";

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">{label}</span>
            {children}
        </label>
    );
}

export default Field;