import { features } from "@/data/features";

/**
 * FeaturesSection — Feature bar and bento grid showcasing capabilities.
 */
export function FeaturesSection() {
  return (
    <>
      {/* Feature bar */}
      <section className="border-y border-border bg-[rgba(10,10,12,0.8)]">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap lg:flex-nowrap">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`flex-1 min-w-[160px] flex items-center gap-3 py-[22px] px-6 cursor-default transition-colors duration-200 hover:bg-primary-light/40 ${
                  i < features.length - 1 ? "border-r border-border" : ""
                }`}
              >
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-foreground leading-tight">
                    {f.label}
                  </div>
                  <div className="text-[11px] text-muted">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything you need — Bento grid */}
      <section className="section-py border-b border-border bg-[rgba(6,6,8,0.5)]">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="section-label">Features</div>
            <h2 className="section-heading max-w-[500px]">
              Everything you need
            </h2>
            <p className="section-body text-center mt-4">
              Production-grade access control. Zero external dependencies.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-12 gap-3">
            {/* 1. Explain Engine — large, 7 cols */}
            <div className="col-span-12 lg:col-span-7 card-base card-glow p-8 flex flex-col gap-5 min-h-[280px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[22px]">🔍</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                      Explain Engine
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground -tracking-[0.02em] leading-tight mb-2.5">
                    Every decision, fully explained
                  </h3>
                  <p className="text-[13px] text-muted leading-relaxed max-w-[380px]">
                    No more debugging with console logs. Get matched rules,
                    missing permissions, timestamps, and the origin of every
                    decision.
                  </p>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-border-light flex-1">
                <pre className="m-0 text-[11px] font-mono text-foreground/55 leading-relaxed">
                  {`const decision = useAccessDecision("users.create");

// → {
//     allowed:     true,
//     reason:      "matched",
//     matched:     ["users.create"],
//     checkedFrom: "direct",
//     timestamp:   "2026-06-26T..."
//   }`}
                </pre>
              </div>
            </div>

            {/* 2. Navigation Filtering — 5 cols */}
            <div className="col-span-12 lg:col-span-5 card-base card-glow p-8 flex flex-col gap-5 min-h-[280px]">
              <div className="flex items-center gap-2">
                <span className="text-[22px]">🌀</span>
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                  Nav Filtering
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground -tracking-[0.02em] leading-tight">
                Automatic sidebar filtering
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Pass your navigation config. Get back only what the user can
                see. Recursive, nested, zero boilerplate.
              </p>
              <div className="bg-black/40 rounded-xl p-3 border border-border-light">
                <pre className="m-0 text-[10px] font-mono text-foreground/50 leading-relaxed">
                  {`const nav = filterNavigation(
  allRoutes,
  engine
);`}
                </pre>
              </div>
            </div>

            {/* 3. RBAC — 4 cols */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 card-base card-glow p-7 flex flex-col gap-3.5">
              <span className="text-[22px]">🛡️</span>
              <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
                RBAC + Role Expansion
              </h3>
              <p className="text-[13px] text-muted leading-relaxed flex-1">
                Map roles to permission arrays. Auto-expanded at check time.
                Source tracked as <code>checkedFrom: &quot;role&quot;</code>.
              </p>
              <div className="text-[11px] font-semibold text-accent-foreground font-mono">
                role → permissions
              </div>
            </div>

            {/* 4. Feature Flags — 4 cols */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 card-base card-glow p-7 flex flex-col gap-3.5">
              <span className="text-[22px]">🚩</span>
              <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
                Feature Flags
              </h3>
              <p className="text-[13px] text-muted leading-relaxed flex-1">
                Built-in flag support with the same unified API. Use{" "}
                <code className="text-[10px]">&lt;Can flag=&#39;beta&#39;&gt;</code>{" "}
                just like permissions.
              </p>
              <div className="text-[11px] font-semibold text-[#a78bfa] font-mono">
                unified API
              </div>
            </div>

            {/* 5. SSR — 4 cols */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 card-base card-glow p-7 flex flex-col gap-3.5">
              <span className="text-[22px]">⚛️</span>
              <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
                SSR + Next.js
              </h3>
              <p className="text-[13px] text-muted leading-relaxed flex-1">
                Fully server-side rendering compatible. Hydrates cleanly. Works
                in React Server Components.
              </p>
              <div className="text-[11px] font-semibold text-success font-mono">
                hydration safe
              </div>
            </div>

            {/* 6. TypeScript — 6 cols */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 card-base card-glow p-7 flex flex-col gap-3.5">
              <span className="text-[22px]">⚡</span>
              <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
                TypeScript Native · ~5kB · Zero Deps
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Full types everywhere. ESM + CJS. Tree-shakeable — import only
                what you use. No peer dependency conflicts.
              </p>
            </div>

            {/* 7. Debug Tools — 6 cols */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 card-base card-glow p-7 flex flex-col gap-3.5">
              <span className="text-[22px]">🐞</span>
              <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
                Debug Tooling
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                <code className="text-[11px]">formatDecision()</code> and{" "}
                <code className="text-[11px]">inspectAccess()</code> give
                human-readable diagnostics. Paste in a bug report and it makes
                sense.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
