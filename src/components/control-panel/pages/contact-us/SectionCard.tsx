import type { ReactNode } from "react";

export default function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
            <div className="mt-4 space-y-3">{children}</div>
        </div>
    );
}