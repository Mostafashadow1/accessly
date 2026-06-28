"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Accessly] Runtime error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 text-center">
      {/* Warning icon */}
      <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-6">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-foreground -tracking-[0.02em] mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-muted max-w-[380px] leading-relaxed mb-8 text-balance">
        An unexpected error occurred. You can try again, or return home if the
        problem persists.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-foreground border border-border no-underline transition-all duration-200 hover:border-border-hover hover:bg-surface-hover active:scale-[0.97]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
