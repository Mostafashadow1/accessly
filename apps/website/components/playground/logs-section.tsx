"use client";

import { useRef, useEffect } from "react";
import type { LogEntry } from "@/types/playground";

export function LogsSection({
  logs,
  open,
  onToggle,
}: {
  logs: LogEntry[];
  open: boolean;
  onToggle: () => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom when new logs arrive */
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs, open]);

  return (
    <div className="mt-4 rounded-xl border border-border overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-mono text-muted-dark hover:text-foreground hover:bg-surface-hover transition-colors"
        aria-expanded={open}
        aria-controls="playground-logs-panel"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">📋</span>
          Activity Log
          {logs.length > 0 && (
            <span className="text-foreground/40 font-medium">
              ({logs.length})
            </span>
          )}
        </span>
        <span
          className="text-[10px] transition-transform duration-200"
          aria-hidden="true"
        >
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div
          id="playground-logs-panel"
          ref={listRef}
          className="max-h-[160px] overflow-y-auto border-t border-border p-3 space-y-1.5 bg-black/20"
          role="log"
          aria-live="polite"
          aria-label="Request activity log"
        >
          {logs.length === 0 ? (
            <p className="text-[10px] text-muted-dark/50 italic font-mono">
              Click <span className="text-foreground/60 not-italic">&quot;Send Request&quot;</span> to see
              the activity log
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 text-[10px] font-mono leading-relaxed"
              >
                <span className="shrink-0 mt-0.5" aria-hidden="true">
                  {log.emoji}
                </span>
                <span className="text-foreground/70">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
