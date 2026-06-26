"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "tsx", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCopy();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-border/80 code-panel-accent">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface/60 border-b border-border min-h-[40px]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57", border: "1px solid rgba(0,0,0,0.3)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e", border: "1px solid rgba(0,0,0,0.3)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840", border: "1px solid rgba(0,0,0,0.3)" }} />
          </div>
          <span className="text-xs font-mono text-muted ml-1">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-150 border border-transparent ${
            copied
              ? "text-success bg-success-bg border-success/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover hover:border-border"
          }`}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}
