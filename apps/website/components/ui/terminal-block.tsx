"use client";

import { useState } from "react";

interface TerminalBlockProps {
  commands: string[];
  title?: string;
}

export function TerminalBlock({ commands, title = "Terminal" }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border-light bg-black overflow-hidden font-mono text-sm">
      {/* Header with traffic lights */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border-b border-border-light">
        <span className="w-2.5 h-2.5 rounded-full bg-danger" />
        <span className="w-2.5 h-2.5 rounded-full bg-warning" />
        <span className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="ml-2 text-xs font-medium text-muted">{title}</span>
        <button
          onClick={handleCopy}
          className="ml-auto text-xs font-medium px-2 py-1 rounded transition-colors text-muted hover:text-foreground hover:bg-surface-hover"
          aria-label={copied ? "Copied" : "Copy commands"}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Content */}
      <div className="p-4 text-sm leading-relaxed text-foreground">
        {commands.map((cmd, i) => (
          <div key={i} className={i < commands.length - 1 ? "mb-1" : ""}>
            <span className="text-primary">$</span> {cmd}
          </div>
        ))}
      </div>
    </div>
  );
}
