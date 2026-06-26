import { diagItems } from "@/data/features";

/**
 * DecisionSection — shows the decision inspector with live UI diagnostics.
 */
export function DecisionSection() {
  return (
    <section className="section-py border-b border-border bg-[rgba(6,6,8,0.5)]">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="section-label">Inspection</div>
          <h2 className="section-heading">Every decision explains itself</h2>
          <p className="section-body text-center mt-4">
            No more guessing why access was denied. Get the full story every
            time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: JSON */}
          <div className="panel-dark overflow-hidden flex flex-col">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
                <span className="font-mono text-[11px] text-muted ml-1.5">
                  decision.json
                </span>
              </div>
            </div>
            <pre className="m-0 flex-1 p-6 text-[13px] font-mono leading-relaxed text-foreground/70 overflow-auto">{`{
  "allowed":     false,
  "reason":      "missing_permissions",
  "requested":   ["settings.manage"],
  "matched":     [],
  "missing":     ["settings.manage"],
  "checkedFrom": "direct",
  "timestamp":   "2026-06-26T11:39:00.000Z"
}`}</pre>
          </div>

          {/* Right: Human-readable cards */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-muted-dark uppercase tracking-[0.06em] mb-1">
              Live UI Diagnostics
            </h3>

            {diagItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-5 py-4 rounded-xl border transition-all duration-200 ${
                  item.allowed
                    ? "border-success/18 bg-success-bg"
                    : "border-danger/18 bg-danger-bg"
                }`}
              >
                <span
                  className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    item.allowed
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {item.allowed ? "✓" : "✕"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                    <code
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.allowed
                          ? "text-success/80 bg-success/6 border-success/15"
                          : "text-danger/80 bg-danger/6 border-danger/15"
                      }`}
                    >
                      {item.perm}
                    </code>
                  </div>
                  <div className="text-xs text-muted mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
