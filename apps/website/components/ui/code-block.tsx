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
    <div className="code-block">
      <div className="code-block-header">
        <span>{title || language}</span>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copied ? "copy-btn-copied" : ""}`}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="code-block-content">
        <pre>{code}</pre>
      </div>
    </div>
  );
}
