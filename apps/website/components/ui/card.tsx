import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}

export function CardGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${cols === 3 ? "grid-3" : "grid-2"}`}>
      {children}
    </div>
  );
}
