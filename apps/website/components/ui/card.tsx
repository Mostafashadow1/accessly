import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:shadow-lg ${className}`}
    >
      {header && (
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {header}
        </div>
      )}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

export function CardGrid({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-6 md:gap-8 ${
        cols === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {children}
    </div>
  );
}
