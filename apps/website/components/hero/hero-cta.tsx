"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Package manager configuration ─────────── */

type PackageManager = "pnpm" | "npm" | "bun" | "yarn";

const pmConfig: Record<PackageManager, { command: string; label: string }> = {
  pnpm: { command: "pnpm add accessly", label: "pnpm" },
  npm: { command: "npm install accessly", label: "npm" },
  bun: { command: "bun add accessly", label: "bun" },
  yarn: { command: "yarn add accessly", label: "Yarn" },
};

const pmList: PackageManager[] = ["pnpm", "npm", "bun", "yarn"];

/* ── Component ─────────────────────────────── */

/**
 * HeroCTA — primary/secondary action buttons + interactive install command.
 *
 * The install area features package-manager tabs (pnpm, npm, bun, yarn)
 * with a copy-able command that updates when the selected tab changes.
 * Default package manager is pnpm.
 */
export function HeroCTA() {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pmConfig[pm].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Primary navigation actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/lab" className="btn-primary">
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
        <Link href="/docs" className="btn-secondary">
          Read the Docs
        </Link>
      </div>

      {/* Interactive install area */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Package-manager tabs */}
        <div className="flex items-center gap-0.5 bg-surface rounded-lg p-0.5 border border-border">
          {pmList.map((id) => (
            <button
              key={id}
              onClick={() => {
                setPm(id);
                setCopied(false);
              }}
              className={`px-3 py-1.5 text-[11px] font-mono font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                pm === id
                  ? "bg-primary/12 text-accent shadow-sm border border-primary/15"
                  : "text-muted hover:text-foreground border border-transparent"
              }`}
            >
              {pmConfig[id].label}
            </button>
          ))}
        </div>

        {/* Command display with copy button */}
        <button
          onClick={handleCopy}
          className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface border border-border hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-200 cursor-pointer"
        >
          <span className="text-primary font-mono text-sm font-bold select-none">
            $
          </span>
          <span className="font-mono text-sm text-foreground/80 group-hover:text-foreground transition-colors whitespace-nowrap">
            {copied ? "Copied!" : pmConfig[pm].command}
          </span>
          <span className="shrink-0 text-muted-dark group-hover:text-muted transition-colors">
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
      </div>
    </div>
  );
}
