import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-medium text-[#3a2c22]/70">{label}</span>
      {children}
    </label>
  );
}