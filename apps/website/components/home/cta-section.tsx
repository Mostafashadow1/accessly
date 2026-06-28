/**
 * CtaSection — bottom call-to-action. Maximum negative space, single focus.
 *
 * Design intent: the page's final word. Confident, clean, no noise.
 * One primary action, one install command, trust indicators below.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { trustItems } from "@/data/features";

export function CtaSection() {
  const [ctaCopied, setCtaCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setCtaCopied(true);
    setTimeout(() => setCtaCopied(false), 1800);
  };

  return (
    <section
      id="cta"
      className="relative py-24 md:py-40 overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 45%, transparent 70%)",
        }}
      />
      {/* Arc ring */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-[50%] border border-[rgba(99,102,241,0.05)] pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center gap-8">

        {/* Heading */}
        <div className="max-w-[600px]">
          <h2
            className="font-bold -tracking-[0.035em] leading-[1.06] text-foreground mb-4"
            style={{ fontSize: "clamp(36px,5vw,64px)" }}
          >
            Ready to simplify
            <br />
            access control?
          </h2>
          <p className="text-[15px] leading-[1.75] text-muted mx-auto max-w-[420px]">
            No install required. Test against your backend in the interactive
            lab — then copy the generated code directly.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/30 no-underline transition-all duration-200 hover:shadow-xl hover:shadow-primary/45 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Open Accessly Lab
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 3l5 5-5 5" />
            </svg>
          </Link>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-mono font-medium text-foreground border border-border transition-all duration-200 hover:border-border-hover hover:bg-surface-hover active:scale-[0.97] cursor-pointer"
            aria-label="Copy install command: pnpm add accessly"
          >
            <span className="text-primary font-bold">$</span>
            {ctaCopied ? (
              <span className="text-success">Copied!</span>
            ) : (
              "pnpm add accessly"
            )}
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border/60 w-full max-w-[580px]">
          {trustItems.map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[12px] text-muted">
              <span className="text-success font-bold" aria-hidden="true">✓</span>
              {t}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
