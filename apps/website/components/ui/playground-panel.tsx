import type { ReactNode } from "react";

interface PlaygroundPanelProps {
  header?: string;
  children: ReactNode;
}

export function PlaygroundPanel({ header, children }: PlaygroundPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-border/80">
      {header && (
        <div className="flex items-center gap-2 px-5 py-3 bg-surface-hover border-b border-border text-xs font-semibold text-muted uppercase tracking-wider">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
