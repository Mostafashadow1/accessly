"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface ExampleShellProps {
  title: string;
  description: string;
  icon: string;
  apisTested: string[];
  children: ReactNode;
  codeSnippet: ReactNode;
  explanation: string;
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ExampleShell({
  title,
  description,
  icon,
  apisTested,
  children,
  codeSnippet,
  explanation,
}: ExampleShellProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted mt-1">{description}</p>
          </div>
        </div>

        {/* APIs Tested */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono mr-1 self-center">
            APIs Tested:
          </span>
          {apisTested.map((api) => (
            <Badge key={api} variant="info">{api}</Badge>
          ))}
        </div>
      </div>

      {/* Live Example */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-elevated flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-[11px] font-bold text-foreground font-mono">Live Preview</span>
          <span className="text-[10px] text-muted font-mono">· interactive</span>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>

      {/* Code */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-foreground">Code</span>
          <span className="text-[10px] text-muted font-mono">· Accessly integration</span>
        </div>
        {codeSnippet}
      </div>

      {/* Explanation */}
      <div className="rounded-xl border border-border/50 bg-surface/30 p-5">
        <span className="text-[11px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-2">
          <span>💡</span> What This Tests
        </span>
        <p className="text-sm text-muted leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
