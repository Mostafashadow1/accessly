/**
 * BentoGridSection — "Everything you need" feature showcase.
 *
 * 12-column asymmetric bento grid. Each card has a distinct visual weight.
 * Cards 1–2 are hero-sized; 3–5 are medium; 6–7 are wide half-cards.
 */

/* ── Shared bento card style ─────────────────────────────── */
const CARD =
  "rounded-2xl border border-border bg-surface hover:border-primary/25 hover:bg-surface-2 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.10),0_12px_48px_rgba(99,102,241,0.07)] transition-all duration-300";

/* ── Section pill label ──────────────────────────────────── */
function Pill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-accent bg-primary-light border border-primary/15 mb-5">
      {label}
    </div>
  );
}

export function BentoGridSection() {
  return (
    <section
      id="features"
      className="py-24 md:py-36 border-b border-border bg-[rgba(6,6,8,0.5)]"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <Pill label="Features" />
          <h2
            className="font-bold -tracking-[0.03em] leading-[1.06] text-foreground max-w-[480px]"
            style={{ fontSize: "clamp(32px,4.5vw,52px)" }}
          >
            Everything you need
          </h2>
          <p className="text-[15px] leading-[1.75] text-muted max-w-[480px] mt-4">
            Production-grade access control. Zero external dependencies.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4">

          {/* ① Explain Engine — 7 cols, hero card */}
          <div className={`col-span-12 lg:col-span-7 ${CARD} p-8 flex flex-col gap-5 min-h-[300px]`}>
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[22px]">🔍</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                  Explain Engine
                </span>
              </div>
              <h3 className="text-[22px] font-bold text-foreground -tracking-[0.02em] leading-tight mb-2">
                Every decision, fully explained
              </h3>
              <p className="text-[13px] text-muted leading-relaxed max-w-[380px]">
                No more debugging with console logs. Get matched rules, missing
                permissions, timestamps, and the origin of every decision.
              </p>
            </div>
            {/* Code preview */}
            <div className="bg-black/50 rounded-xl p-4 border border-border-light flex-1">
              <pre className="m-0 text-[11px] font-mono leading-relaxed text-foreground/55">
                {`const decision = useAccessDecision("users.create");\n\n// {\n//   allowed:     true,\n//   reason:      "matched",\n//   matched:     ["users.create"],\n//   checkedFrom: "direct",\n//   timestamp:   "${new Date().toISOString().split("T")[0]}T..."\n// }`}
              </pre>
            </div>
          </div>

          {/* ② Nav Filtering — 5 cols */}
          <div className={`col-span-12 lg:col-span-5 ${CARD} p-8 flex flex-col gap-4 min-h-[300px]`}>
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">🌀</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                Nav Filtering
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              Automatic sidebar filtering
            </h3>
            <p className="text-[13px] text-muted leading-relaxed flex-1">
              Pass your navigation config. Get back only what the user can see.
              Recursive, nested, zero boilerplate.
            </p>
            <div className="bg-black/50 rounded-xl p-3.5 border border-border-light">
              <pre className="m-0 text-[11px] font-mono text-foreground/50 leading-relaxed">
                {`const nav = filterNavigation(\n  allRoutes,\n  engine\n);`}
              </pre>
            </div>
          </div>

          {/* ③ RBAC — 4 cols */}
          <div className={`col-span-12 sm:col-span-6 lg:col-span-4 ${CARD} p-7 flex flex-col gap-3`}>
            <span className="text-[22px]">🛡️</span>
            <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              RBAC + Role Expansion
            </h3>
            <p className="text-[13px] text-muted leading-relaxed flex-1">
              Map roles to permission arrays. Auto-expanded at check time.
              Source tracked as{" "}
              <code className="text-[11px]">checkedFrom: &quot;role&quot;</code>.
            </p>
            <div className="text-[11px] font-semibold text-accent font-mono mt-1">
              role → permissions
            </div>
          </div>

          {/* ④ Feature Flags — 4 cols */}
          <div className={`col-span-12 sm:col-span-6 lg:col-span-4 ${CARD} p-7 flex flex-col gap-3`}>
            <span className="text-[22px]">🚩</span>
            <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              Feature Flags
            </h3>
            <p className="text-[13px] text-muted leading-relaxed flex-1">
              Built-in flag support with the same unified API. Use{" "}
              <code className="text-[11px]">&lt;Can flag=&apos;beta&apos;&gt;</code>{" "}
              just like permissions.
            </p>
            <div className="text-[11px] font-semibold text-violet font-mono mt-1">
              unified API
            </div>
          </div>

          {/* ⑤ SSR — 4 cols */}
          <div className={`col-span-12 sm:col-span-6 lg:col-span-4 ${CARD} p-7 flex flex-col gap-3`}>
            <span className="text-[22px]">⚛️</span>
            <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              SSR + Next.js Ready
            </h3>
            <p className="text-[13px] text-muted leading-relaxed flex-1">
              Fully server-side rendering compatible. Hydrates cleanly. Works
              in React Server Components.
            </p>
            <div className="text-[11px] font-semibold text-success font-mono mt-1">
              hydration safe
            </div>
          </div>

          {/* ⑥ TypeScript — 6 cols */}
          <div className={`col-span-12 sm:col-span-6 ${CARD} p-7 flex flex-col gap-3`}>
            <span className="text-[22px]">⚡</span>
            <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              TypeScript Native · ~5kB · Zero Deps
            </h3>
            <p className="text-[13px] text-muted leading-relaxed">
              Full types everywhere. ESM + CJS. Tree-shakeable — import only
              what you use. No peer dependency conflicts.
            </p>
          </div>

          {/* ⑦ Debug Tools — 6 cols */}
          <div className={`col-span-12 sm:col-span-6 ${CARD} p-7 flex flex-col gap-3`}>
            <span className="text-[22px]">🐞</span>
            <h3 className="text-[17px] font-bold text-foreground -tracking-[0.02em] leading-tight">
              Debug Tooling
            </h3>
            <p className="text-[13px] text-muted leading-relaxed">
              <code className="text-[11px]">formatDecision()</code> and{" "}
              <code className="text-[11px]">inspectAccess()</code> give
              human-readable diagnostics. Paste into a bug report and it makes
              sense immediately.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
