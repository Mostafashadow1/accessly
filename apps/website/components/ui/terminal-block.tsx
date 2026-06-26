"use client";

import { useState } from "react";

interface TerminalBlockProps {
  commands: string[];
  title?: string;
}

export function TerminalBlock({
  commands,
  title = "Terminal",
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-black overflow-hidden font-mono text-sm transition-all duration-200 hover:border-border/80">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-surface/80 border-b border-border min-h-[40px]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <span className="text-[11px] font-mono text-muted">{title}</span>
        <button
          onClick={handleCopy}
          tabIndex={0}
          className={`ml-auto text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all duration-150 border ${
            copied
              ? "text-success bg-success-bg border-success/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover border-transparent hover:border-border"
          }`}
          aria-label={copied ? "Copied" : "Copy commands"}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Body */}
      <div className="p-5 text-sm leading-relaxed text-foreground/85">
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={`font-mono ${i < commands.length - 1 ? "mb-2" : ""}`}
          >
            <span className="text-primary font-bold select-none">$ </span>
            <span className="text-foreground/80">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
