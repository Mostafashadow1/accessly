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

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-surface/60 border-b border-border">
        <span className="text-xs font-medium text-muted">{title || language}</span>
        <button
          onClick={handleCopy}
          className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
            copied
              ? "text-accent bg-primary-light"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-5 overflow-x-auto text-sm leading-relaxed text-foreground">
        <pre className="m-0 whitespace-pre-wrap font-mono">{code}</pre>
      </div>
    </div>
  );
}
