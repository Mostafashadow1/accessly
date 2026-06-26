import { pipelineSteps, explainItems } from "@/data/features";

/**
 * HowItWorksSection — Architecture pipeline explanation with step cards
 * and a code + explanation split view.
 */
export function HowItWorksSection() {
  return (
    <section className="py-[100px] md:py-[140px] border-b border-border">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase text-accent bg-primary-light border border-primary/15 mb-5">Architecture</div>
          <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold -tracking-[0.03em] leading-[1.08] text-foreground max-w-[560px]">
            How Accessly works
          </h2>
          <p className="text-[15px] leading-[1.75] text-muted text-center mt-4 max-w-[480px]">
            A transparent pipeline from API response to gated UI — every step
            is observable.
          </p>
        </div>

        {/* 5-step horizontal timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-border)_10%,var(--color-border)_90%,transparent)] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {pipelineSteps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-border bg-surface hover:border-primary/20 hover:bg-surface-2 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.1),0_8px_40px_rgba(99,102,241,0.08)] transition-all duration-250 flex flex-col gap-4 p-6 relative"
              >
                {/* Step badge */}
                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-[11px] font-bold"
                  style={{
                    background: `${step.color}14`,
                    border: `1px solid ${step.color}28`,
                    color: step.color,
                  }}
                >
                  {step.num}
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-1.5">
                    {step.title}
                  </div>
                  <div className="text-xs text-muted leading-relaxed">
                    {step.desc}
                  </div>
                </div>

                <pre className="m-0 text-[10px] font-mono text-foreground/50 bg-black/35 rounded-lg p-3 border border-border-light overflow-auto whitespace-pre-wrap">
                  <code>{step.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Code + Explanation split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-16">
          {/* Code panel */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-[rgba(6,6,8,0.7)] backdrop-blur-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 min-h-[40px] border-b border-border bg-[rgba(12,12,15,0.8)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
                <span className="font-mono text-[11px] text-muted ml-1.5">
                  access-example.tsx
                </span>
              </div>
            </div>
            <pre className="m-0 flex-1 text-[12px] font-mono leading-relaxed text-foreground/75 p-6 md:p-7 overflow-auto">{`import { createAdapter, PermissionProvider, Can } from "accessly";

// 1. Define adapter for your backend
const adapter = createAdapter((src) => ({
  permissions: src.user.scopes,
  roles: [src.user.role],
  user: { id: src.user.userId },
}));

// 2. Wrap your app once
export function App({ apiData }) {
  return (
    <PermissionProvider source={apiData} adapter={adapter}>
      <Dashboard />
    </PermissionProvider>
  );
}

// 3. Gate any component declaratively
function Dashboard() {
  return (
    <Can permission="users.create">
      <button>Create User</button>  {/* only renders if allowed */}
    </Can>
  );
}

// 4. Or get the full decision object
const decision = useAccessDecision("users.create");
// → { allowed: true, reason: "matched",
//     matched: ["users.create"], checkedFrom: "direct" }`}</pre>
          </div>

          {/* Explanation card */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface hover:border-primary/20 hover:bg-surface-2 transition-all duration-250 flex flex-col p-8 gap-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-dark mb-3">
                Why this matters
              </div>
              <h3 className="text-[clamp(22px,3vw,38px)] font-bold -tracking-[0.025em] leading-[1.12] text-foreground">Transparent by design</h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Authorization decisions affect every user&apos;s experience. Accessly
              tracks every check so you can always answer:{" "}
              <em className="text-foreground not-italic font-medium">
                why was this allowed or denied?
              </em>
            </p>

            <ul className="flex flex-col gap-3 list-none">
              {explainItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}28`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px] text-muted leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
