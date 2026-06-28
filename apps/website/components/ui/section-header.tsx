import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  description,
  badge,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 mb-12 max-w-2xl ${
        align === "center" ? "items-center text-center mx-auto" : ""
      }`}
    >
      {badge && <div className="mb-1">{badge}</div>}
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
