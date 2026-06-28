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
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden font-mono text-sm transition-all duration-200 hover:border-[var(--color-border-strong)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-surface)]/80 border-b border-[var(--color-border)] min-h-[40px]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
          {title}
        </span>
        <button
          onClick={handleCopy}
          tabIndex={0}
          className={`ml-auto text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all duration-150 border ${
            copied
              ? "text-[var(--color-success)] bg-[var(--color-success-subtle)] border-[var(--color-success)]/20"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] border-transparent hover:border-[var(--color-border)]"
          }`}
          aria-label={copied ? "Copied" : "Copy commands"}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Body */}
      <div className="p-5 text-sm leading-relaxed text-[var(--color-text-primary)]/85">
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={`font-mono ${i < commands.length - 1 ? "mb-2" : ""}`}
          >
            <span className="text-[var(--color-primary)] font-bold select-none">
              ${" "}
            </span>
            <span className="text-[var(--color-text-primary)]/80">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
