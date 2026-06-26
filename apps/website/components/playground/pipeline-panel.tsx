import type { PanelStatus } from "@/types/playground";
import { PanelSkeleton } from "./panel-skeleton";

export function PipelinePanel({
  num,
  title,
  status,
  accentIdle,
  accentActive,
  children,
}: {
  num: string;
  title: string;
  status: PanelStatus;
  accentIdle: string;
  accentActive: string;
  children: React.ReactNode;
}) {
  const isActive = status === "active";
  const isLoading = status === "loading";
  const isPending = status === "pending";
  const isDimmed = isPending || isLoading;

  const borderClass = isActive ? "border-primary/40" : "border-border";
  const bgClass = isActive
    ? "bg-surface/80"
    : isDimmed
      ? "bg-surface/40"
      : "bg-surface/60";
  const shadowClass = isActive ? "shadow-sm shadow-primary/10" : "shadow-sm";

  return (
    <div
      className={`flex-1 min-w-0 rounded-xl border ${borderClass} ${bgClass} overflow-hidden flex flex-col ${shadowClass} transition-all duration-500`}
      aria-busy={isLoading}
    >
      {/* Colored accent line */}
      <div
        className={`h-0.5 transition-colors duration-500 ${
          isActive ? accentActive : accentIdle
        }`}
      />
      {/* Header */}
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 border-b transition-colors duration-300 ${
          isActive
            ? "border-primary/20 bg-primary/[0.04]"
            : "border-border/50 bg-[rgba(8,8,10,0.3)]"
        }`}
      >
        <span
          className={`text-[9px] font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded transition-colors duration-300 ${
            isActive
              ? "text-primary bg-primary/15"
              : "text-muted-dark bg-surface/40"
          }`}
        >
          {num}
        </span>
        <span
          className={`text-[11px] font-semibold truncate transition-colors duration-300 ${
            isActive ? "text-foreground" : "text-foreground/60"
          }`}
        >
          {title}
        </span>
        {/* Checkmark when settled */}
        {status === "settled" && (
          <span className="ml-auto text-[10px] text-success/70" aria-hidden="true">
            ✓
          </span>
        )}
        {/* Pulse dot when active */}
        {isActive && (
          <span className="ml-auto flex items-center gap-1 text-[9px] font-mono text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            processing
          </span>
        )}
      </div>
      {/* Content area */}
      <div
        className={`p-3 flex-1 flex flex-col transition-opacity duration-500 ${
          isDimmed ? "opacity-30" : isActive ? "opacity-100" : "opacity-90"
        }`}
      >
        {isLoading ? (
          <PanelSkeleton
            lines={
              title === "Decision" || title === "UI Preview" ? 4 : 6
            }
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
