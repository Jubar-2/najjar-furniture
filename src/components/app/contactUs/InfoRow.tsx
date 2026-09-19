import type { ReactNode } from "react";

export function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="mt-0.5 text-[#c9a06a] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1 break-words">
        <p className="text-[11px] sm:text-xs text-[#f2ead9]/60">{label}</p>
        <p className="font-medium text-xs sm:text-sm text-[#f2ead9] break-all">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 transition-opacity hover:opacity-80">
        {inner}
      </a>
    );
  }

  return <div className="flex items-start gap-3">{inner}</div>;
}