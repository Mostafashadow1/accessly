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
    <div className={`section-header ${align === "center" ? "section-header-centered" : ""}`}>
      {badge && <div>{badge}</div>}
      <h2 className="section-header-title">{title}</h2>
      {description && (
        <p className="section-header-desc">{description}</p>
      )}
    </div>
  );
}
