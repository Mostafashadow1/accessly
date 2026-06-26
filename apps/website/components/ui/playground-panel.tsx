import type { ReactNode } from "react";

interface PlaygroundPanelProps {
  header?: string;
  children: ReactNode;
}

export function PlaygroundPanel({ header, children }: PlaygroundPanelProps) {
  return (
    <div className="rounded-xl border border-border-light bg-surface overflow-hidden">
      {header && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-hover border-b border-border-light text-xs font-semibold text-muted uppercase tracking-wider">
          {header}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
