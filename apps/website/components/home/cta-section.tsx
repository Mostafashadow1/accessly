"use client";

import { useState } from "react";
import Link from "next/link";
import { trustItems } from "@/data/features";

/**
 * CtaSection — bottom call-to-action with install command and trust badges.
 */
export function CtaSection() {
  const [ctaCopied, setCtaCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setCtaCopied(true);
    setTimeout(() => setCtaCopied(false), 1800);
  };

  return (
    <section className="section-py !pb-[160px] relative overflow-hidden">
      {/* Subtle radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.07)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center gap-8">
        <div>
          <h2 className="section-heading text-[clamp(36px,5vw,64px)] max-w-[640px] mx-auto mb-4">
            Ready to simplify
            <br />
            access control?
          </h2>
          <p className="section-body text-center mx-auto max-w-[440px]">
            No install required. Test against your backend in the interactive
            lab — then copy the generated code directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/lab" className="btn-primary text-[15px] py-3.5 px-7">
            Open Accessly Lab
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
          <button
            onClick={handleCopy}
            className="btn-secondary font-mono text-sm py-3.5 px-7"
          >
            <span className="text-primary font-bold">$</span>
            {ctaCopied ? "Copied!" : "pnpm add accessly"}
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-6 border-t border-border w-full max-w-[640px]">
          {trustItems.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 text-xs text-muted"
            >
              <span className="text-primary">✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
