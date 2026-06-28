"use client";

import { useCallback, useRef } from "react";

interface BackendJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onLoadExample: () => void;
  onReset: () => void;
  onFormat: () => void;
  error: string | null;
}

export function BackendJsonEditor({
  value,
  onChange,
  onLoadExample,
  onReset,
  onFormat,
  error,
}: BackendJsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const newValue =
          value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 2;
            textareaRef.current.selectionEnd = start + 2;
          }
        });
      }
    },
    [value, onChange],
  );

  const lineCount = value.split("\n").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          Backend Response
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onLoadExample}
            className="text-[10px] px-2 py-1 rounded-md bg-surface/50 border border-border/20 text-muted-dark hover:text-foreground hover:border-border/40 transition-colors"
          >
            Load Example
          </button>
          <button
            type="button"
            onClick={onFormat}
            className="text-[10px] px-2 py-1 rounded-md bg-surface/50 border border-border/20 text-muted-dark hover:text-foreground hover:border-border/40 transition-colors"
          >
            Format
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] px-2 py-1 rounded-md bg-surface/50 border border-border/20 text-muted-dark hover:text-foreground hover:border-border/40 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="relative rounded-xl border border-border/20 bg-surface/20 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[200px] font-mono text-xs leading-relaxed p-4 bg-transparent text-foreground placeholder-muted-dark resize-y focus:outline-none focus:ring-1 focus:ring-primary/30"
          spellCheck={false}
          placeholder='Paste your backend JSON response here...'
          style={{ tabSize: 2 }}
        />
        {/* Line count indicator */}
        <div className="absolute bottom-2 right-3 text-[9px] text-muted-dark/60 font-mono">
          {lineCount} lines
        </div>
      </div>

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <p className="mt-1.5 text-[10px] text-muted-dark/60 leading-relaxed">
        Tab inserts 2 spaces. Edit the JSON to simulate different backend responses.
      </p>
    </div>
  );
}
