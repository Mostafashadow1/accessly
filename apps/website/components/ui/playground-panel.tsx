import type { ReactNode } from "react";

interface PlaygroundPanelProps {
  header?: string;
  children: ReactNode;
}

export function PlaygroundPanel({ header, children }: PlaygroundPanelProps) {
  return (
    <div className="playground-panel">
      {header && (
        <div className="playground-panel-header">
          {header}
        </div>
      )}
      <div className="playground-panel-body">{children}</div>
    </div>
  );
}
