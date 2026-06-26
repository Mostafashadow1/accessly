"use client";

import { useState, type ReactNode } from "react";

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
    <div className="terminal-block">
      <div className="terminal-block-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span
          className="ml-2 text-[11px] font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </span>
        <button
          onClick={handleCopy}
          className="ml-auto text-[11px] font-medium px-2 py-1 rounded transition-colors cursor-pointer"
          style={{
            background: "transparent",
            color: copied ? "var(--color-secondary)" : "var(--text-muted)",
            border: "none",
          }}
          aria-label={copied ? "Copied" : "Copy commands"}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="terminal-block-content">
        {commands.map((cmd, i) => (
          <div key={i} className="terminal-prompt" style={{ marginBottom: i < commands.length - 1 ? "0.25rem" : 0 }}>
            {cmd}
          </div>
        ))}
      </div>
    </div>
  );
}
