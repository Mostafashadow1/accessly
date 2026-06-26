import type { Scenario } from "@/types/playground";

export function ScenarioToggle({
  value,
  onChange,
  disabled,
}: {
  value: Scenario;
  onChange: (v: Scenario) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-border bg-surface p-0.5"
      role="radiogroup"
      aria-label="Decision scenario"
    >
      {(
        [
          { value: "allowed" as Scenario, label: "Allowed" },
          { value: "denied" as Scenario, label: "Denied" },
        ] as const
      ).map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 ${
            value === opt.value
              ? opt.value === "allowed"
                ? "bg-success/15 text-success shadow-sm"
                : "bg-danger/15 text-danger shadow-sm"
              : "text-muted-dark hover:text-foreground disabled:opacity-40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
