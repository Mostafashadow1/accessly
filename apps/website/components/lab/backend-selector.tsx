"use client";

import type { BackendId, BackendPreset } from "@/types/lab";
import { BACKEND_PRESETS } from "@/data/lab-examples";

interface BackendSelectorProps {
  selected: BackendId;
  onChange: (id: BackendId) => void;
}

export function BackendSelector({ selected, onChange }: BackendSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          Backend
        </label>
        <span className="text-[10px] text-muted-dark">
          {BACKEND_PRESETS.find((b) => b.id === selected)?.description}
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
        {BACKEND_PRESETS.map((backend) => {
          const isActive = selected === backend.id;
          return (
            <button
              key={backend.id}
              type="button"
              onClick={() => onChange(backend.id)}
              className={`
                relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs font-medium
                transition-all duration-200 border
                ${
                  isActive
                    ? "bg-surface border-primary/40 shadow-lg shadow-primary/5 text-foreground"
                    : "bg-surface/30 border-border/20 text-muted-dark hover:border-border/40 hover:text-foreground hover:bg-surface/50"
                }
              `}
            >
              <span className="text-base">{backend.icon}</span>
              <span className="text-[10px] leading-tight text-center">
                {backend.name}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
