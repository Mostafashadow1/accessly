import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border-light bg-surface transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/20 ${className}`}
    >
      {header && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-light bg-surface-hover text-xs font-semibold text-muted uppercase tracking-wider">
          {header}
        </div>
      )}
      <div className="p-4">{children}</div>
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
      className={`grid gap-4 ${
        cols === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {children}
    </div>
  );
}
