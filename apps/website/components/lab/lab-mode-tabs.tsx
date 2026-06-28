"use client";

import type { LabMode } from "@/types/lab";

interface LabModeTabsProps {
  active: LabMode;
  onChange: (mode: LabMode) => void;
}

const MODES: { id: LabMode; label: string; description: string }[] = [
  {
    id: "playground",
    label: "Playground",
    description: "Try permissions live",
  },
  {
    id: "inspector",
    label: "Inspector",
    description: "Debug decisions",
  },
  {
    id: "recipes",
    label: "Recipes",
    description: "Real patterns",
  },
];

export function LabModeTabs({ active, onChange }: LabModeTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-surface/50 border border-border/30 p-1">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`
            relative flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              active === mode.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-dark hover:text-foreground hover:bg-surface/30"
            }
          `}
        >
          <span className="hidden sm:inline">{mode.description}</span>
          <span className="sm:hidden">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
