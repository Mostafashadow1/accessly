"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const TrafficLights = () => (
  <div className="flex gap-1.5" aria-hidden="true">
    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/20" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/20" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/20" />
  </div>
);

export function CodeBlock({ code, language = "tsx", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-border/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(12,12,15,0.8)] border-b border-border min-h-[40px]">
        <div className="flex items-center gap-3">
          <TrafficLights />
          <span className="text-[11px] font-mono text-muted ml-1">
            {title || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          tabIndex={0}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all duration-150 border ${
            copied
              ? "text-success bg-success-bg border-success/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover border-transparent hover:border-border"
          }`}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Body */}
      <div className="overflow-x-auto">
        <pre className="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}
