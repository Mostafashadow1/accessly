"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";

interface PermissionCommandProps {
  value: string;
  onChange: (value: string) => void;
  availablePermissions: string[];
  commonPermissions: string[];
}

export function PermissionCommand({
  value,
  onChange,
  availablePermissions,
  commonPermissions,
}: PermissionCommandProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build suggestions: available first, then common, filter by input
  const suggestions = useMemo(() => {
    const query = value.toLowerCase().trim();
    if (!query && !isFocused) return [];

    const all = [
      ...new Set([...availablePermissions, ...commonPermissions]),
    ];

    if (!query) return all.slice(0, 8);

    return all
      .filter((p) => p.toLowerCase().includes(query))
      .slice(0, 8);
  }, [value, availablePermissions, commonPermissions, isFocused]);

  const handleSelect = useCallback(
    (permission: string) => {
      onChange(permission);
      setIsFocused(false);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && suggestions.length > 0) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setIsFocused(false);
      }
    },
    [suggestions, selectedIndex, handleSelect],
  );

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions.length]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const permissionExists = value
    ? availablePermissions.includes(value)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          Permission
        </label>
        {permissionExists === true && (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
            ✓ in AccessModel
          </span>
        )}
        {permissionExists === false && (
          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
            not in AccessModel
          </span>
        )}
      </div>

      <div ref={containerRef} className="relative">
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200
            ${
              isFocused
                ? "border-primary/40 bg-surface shadow-lg shadow-primary/5"
                : "border-border/20 bg-surface/30 hover:border-border/40"
            }
          `}
        >
          <span className="text-muted-dark shrink-0 text-xs">▶</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (!isFocused) setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Type a permission, e.g. repositories.write"
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-dark/50 focus:outline-none font-mono"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-muted-dark hover:text-foreground transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-border/20 bg-surface shadow-2xl shadow-black/30 overflow-hidden">
            {suggestions.map((permission, index) => {
              const isAvailable = availablePermissions.includes(permission);
              return (
                <button
                  key={permission}
                  type="button"
                  onClick={() => handleSelect(permission)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors
                    ${
                      index === selectedIndex
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-dark hover:bg-surface/50 hover:text-foreground"
                    }
                  `}
                >
                  {isAvailable ? (
                    <span className="text-emerald-400 shrink-0">✓</span>
                  ) : (
                    <span className="text-muted-dark/40 shrink-0">·</span>
                  )}
                  <span className="font-mono">{permission}</span>
                  {isAvailable && (
                    <span className="ml-auto text-[9px] text-emerald-400/60">
                      in model
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {availablePermissions.length > 0 && !value && (
        <div className="mt-2 flex flex-wrap gap-1">
          {availablePermissions.slice(0, 6).map((perm) => (
            <button
              key={perm}
              type="button"
              onClick={() => handleSelect(perm)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-surface/40 border border-border/15 text-muted-dark hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors font-mono"
            >
              {perm}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
