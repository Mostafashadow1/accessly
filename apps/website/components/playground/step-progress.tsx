import type { StepDef } from "@/types/playground";

export function StepProgress({
  steps,
  activeIdx,
}: {
  steps: StepDef[];
  activeIdx: number;
}) {
  return (
    <div
      className="flex items-center gap-2 mb-4"
      role="progressbar"
      aria-label="Pipeline progress"
      aria-valuenow={activeIdx + 1}
      aria-valuemin={0}
      aria-valuemax={steps.length}
    >
      {steps.map((step, i) => {
        const state =
          activeIdx < 0
            ? "idle"
            : i < activeIdx
              ? "done"
              : i === activeIdx
                ? "active"
                : "pending";
        return (
          <div
            key={step.key}
            className="flex items-center gap-2 flex-1 last:flex-none"
          >
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold font-mono border transition-all duration-400 ${
                state === "active"
                  ? "bg-primary/20 border-primary text-primary shadow-sm shadow-primary/30 scale-110"
                  : state === "done"
                    ? "bg-success/10 border-success/50 text-success"
                    : state === "pending"
                      ? "bg-transparent border-border/30 text-muted-dark/40"
                      : "bg-transparent border-border text-muted-dark"
              }`}
            >
              {state === "done" ? (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6l2.5 2.5 4.5-5" />
                </svg>
              ) : (
                step.num
              )}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px transition-colors duration-400 ${
                  state === "active" || state === "done"
                    ? "bg-primary/40"
                    : "bg-border/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
