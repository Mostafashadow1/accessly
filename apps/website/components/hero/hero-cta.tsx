"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

/* ── Package manager configuration ─────────── */

type PackageManager = "pnpm" | "npm" | "bun" | "yarn";

const pmConfig: Record<PackageManager, { command: string; label: string }> = {
  pnpm: { command: "pnpm add accessly", label: "pnpm" },
  npm: { command: "npm install accessly", label: "npm" },
  bun: { command: "bun add accessly", label: "bun" },
  yarn: { command: "yarn add accessly", label: "yarn" },
};

const pmList: PackageManager[] = ["pnpm", "npm", "bun", "yarn"];

/* ── Component ─────────────────────────────── */

/**
 * HeroCTA — primary/secondary action buttons + premium interactive install block.
 *
 * Features a sleek terminal-inspired command card with inline package-manager
 * pills, one-click copy, and smooth feedback states.
 */
export function HeroCTA() {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(pmConfig[pm].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [pm]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Primary navigation actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/25 no-underline transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Try Accessly Lab
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 3l5 5-5 5" />
          </svg>
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-foreground bg-transparent border border-border no-underline transition-all duration-200 hover:border-white/20 hover:bg-surface-hover active:scale-[0.97]"
        >
          Read the Docs
        </Link>
      </div>

      {/* ── Premium install command card ── */}
      <div className="w-full max-w-[520px] group">
        <div className="relative rounded-2xl bg-surface/80 border border-border/80 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-primary/5 hover:shadow-xl">
          {/* Inner glow ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.02] pointer-events-none"
          />

          {/* Copy target area */}
          <button
            onClick={handleCopy}
            className="relative flex items-center gap-3 w-full px-5 py-4 cursor-pointer text-left"
            aria-label={`Copy ${pmConfig[pm].command}`}
          >
            {/* Prompt symbol */}
            <span className="text-primary font-mono text-sm font-bold select-none shrink-0">
              $
            </span>

            {/* Command text */}
            <span className="font-mono text-sm text-foreground/80 group-hover:text-foreground transition-colors tracking-tight flex-1">
              {copied ? (
                <span className="inline-flex items-center gap-2 text-success">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied to clipboard
                </span>
              ) : (
                pmConfig[pm].command
              )}
            </span>

            {/* Copy icon */}
            <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/[0.06] border border-primary/10 text-muted-dark group-hover:text-primary group-hover:bg-primary/[0.1] group-hover:border-primary/20 transition-all duration-200">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </span>
          </button>

          {/* Divider */}
          <div className="h-px bg-border/80 mx-5" />

          {/* Package manager pills */}
          <div className="flex items-center gap-1 px-4 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-dark mr-1.5">
              Install with
            </span>
            {pmList.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setPm(id);
                  setCopied(false);
                }}
                className={`relative px-3 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                  pm === id
                    ? "bg-primary/15 text-accent shadow-sm border border-primary/20"
                    : "text-muted hover:text-foreground border border-transparent hover:bg-surface-elevated"
                }`}
              >
                {pmConfig[id].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
