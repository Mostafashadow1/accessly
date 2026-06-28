import type { ReactNode } from "react";

interface PlaygroundPanelProps {
  header?: string;
  children: ReactNode;
}

export function PlaygroundPanel({ header, children }: PlaygroundPanelProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all duration-200 hover:border-[var(--color-border-hover)]">
      {header && (
        <div className="flex items-center gap-2 px-5 py-3 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
