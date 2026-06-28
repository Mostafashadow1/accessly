"use client";

import { useMemo } from "react";
import type { ReplayStep, BackendId } from "@/types/lab";
import { REPLAY_STEPS } from "@/data/lab-examples";
import { BACKEND_PRESETS } from "@/data/lab-examples";

interface DecisionReplayProps {
  activeStep: number;
  isRunning: boolean;
  isDone: boolean;
  granted: boolean | null;
  backendId: BackendId;
  permission: string;
}

export function DecisionReplay({
  activeStep,
  isRunning,
  isDone,
  granted,
  backendId,
  permission,
}: DecisionReplayProps) {
  const backend = BACKEND_PRESETS.find((b) => b.id === backendId);

  const enrichedSteps = useMemo(() => {
    return REPLAY_STEPS.map((step, index) => {
      let label = step.label;
      if (step.id === "adapter" && backend) {
        label = `${backend.name} adapter normalizes payload`;
      }
      if (step.id === "check" && permission) {
        label = `Permission checked: ${permission}`;
      }
      return { ...step, label, enrichedIndex: index };
    });
  }, [backend, permission]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-muted-dark uppercase tracking-wider">
          Decision Replay
        </label>
        {isDone && granted !== null && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              granted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {granted ? "Allowed" : "Denied"} — {activeStep * 2 + "ms"}
          </span>
        )}
        {isRunning && (
          <span className="text-[10px] text-primary/80 animate-pulse">
            running…
          </span>
        )}
      </div>

      <div className="rounded-xl border border-border/15 bg-surface/10 overflow-hidden">
        {enrichedSteps.map((step, index) => {
          const isActive = activeStep === index;
          const isPast = index < activeStep;
          const isFuture = index > activeStep;

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 px-4 py-2.5 border-b border-border/10 last:border-b-0
                transition-all duration-300
                ${isActive ? "bg-primary/5" : ""}
                ${isFuture ? "opacity-25" : ""}
              `}
            >
              {/* Step icon */}
              <span
                className={`
                  shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs
                  transition-all duration-300
                  ${isPast ? "bg-emerald-500/15 text-emerald-400" : ""}
                  ${isActive ? "bg-primary/15 text-primary shadow-sm" : ""}
                  ${isFuture ? "bg-surface/30 text-muted-dark/40" : ""}
                  ${!isPast && !isActive && !isFuture ? "bg-surface/30 text-muted-dark" : ""}
                `}
              >
                {isPast ? "✓" : step.icon}
              </span>

              {/* Label and description */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-medium truncate ${
                    isFuture
                      ? "text-muted-dark/40"
                      : isActive
                        ? "text-foreground"
                        : "text-foreground"
                  }`}
                >
                  {step.label}
                </div>
                <div
                  className={`text-[9px] truncate ${
                    isFuture ? "text-muted-dark/20" : "text-muted-dark/50"
                  }`}
                >
                  {step.description}
                </div>
              </div>

              {/* Timing */}
              <span
                className={`
                  shrink-0 text-[9px] font-mono tabular-nums
                  ${isActive ? "text-primary" : "text-muted-dark/40"}
                `}
              >
                {step.timing}
              </span>
            </div>
          );
        })}

        {/* Animated pulse when running */}
        {isRunning && (
          <div className="h-0.5 bg-surface-2 overflow-hidden">
            <div className="h-full bg-primary/60 w-1/3 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
