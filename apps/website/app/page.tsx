"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";

/*
   Data
    */

interface BackendConfig {
  id: string;
  label: string;
  response: string;
  adapter: string;
  model: string;
}

const backendAdapters: BackendConfig[] = [
  {
    id: "laravel",
    label: "Laravel",
    response: `{
  "id": 1,
  "name": "Alex Admin",
  "all_permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.all_permissions,
  user: {
    id: src.id,
    name: src.name
  }
}))`,
    model: `{
  "permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ],
  "user": {
    "id": 1,
    "name": "Alex Admin"
  }
}`,
  },
  {
    id: "nestjs",
    label: "NestJS",
    response: `{
  "user": {
    "id": "usr_99",
    "roles": ["editor"],
    "abilities": [
      "read:articles",
      "write:articles"
    ]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.user.abilities,
  roles: src.user.roles,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": [
    "read:articles",
    "write:articles"
  ],
  "roles": ["editor"],
  "user": { "id": "usr_99" }
}`,
  },
  {
    id: "aspnet",
    label: "ASP.NET",
    response: `{
  "nameid": "1002",
  "role": ["Administrator"],
  "claims": [
    {
      "type": "permission",
      "value": "billing.read"
    },
    {
      "type": "permission",
      "value": "billing.write"
    }
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.role,
  user: { id: src.nameid }
}))`,
    model: `{
  "permissions": [
    "billing.read",
    "billing.write"
  ],
  "roles": ["Administrator"],
  "user": { "id": "1002" }
}`,
  },
  {
    id: "express",
    label: "Express",
    response: `{
  "sessionID": "sess_881",
  "user": { "id": 42 },
  "scopes": [
    "admin:dashboard",
    "user:edit"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.scopes,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": [
    "admin:dashboard",
    "user:edit"
  ],
  "user": { "id": 42 }
}`,
  },
  {
    id: "custom",
    label: "Custom",
    response: `{
  "meta": { "version": "v2" },
  "body": {
    "profile": { "uuid": "u-873" },
    "grants": [
      "view_dashboard",
      "edit_profile"
    ]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.body.grants.map(
    g => g.replace(/_/, ".")
  ),
  user: {
    id: src.body.profile.uuid
  }
}))`,
    model: `{
  "permissions": [
    "view.dashboard",
    "edit.profile"
  ],
  "user": { "id": "u-873" }
}`,
  },
];

const steps = [
  {
    num: "01",
    title: "Backend Response",
    desc: "Any API shape. No constraints.",
    code: `{ "scopes": ["users.read"] }`,
    color: "#6366f1",
  },
  {
    num: "02",
    title: "Adapter",
    desc: "One function normalizes it.",
    code: `createAdapter(src => ...)`,
    color: "#818cf8",
  },
  {
    num: "03",
    title: "AccessModel",
    desc: "Unified schema. Always consistent.",
    code: `{ permissions: [...] }`,
    color: "#8b5cf6",
  },
  {
    num: "04",
    title: "Engine",
    desc: "Checks, expands roles, validates.",
    code: `engine.check("users.read")`,
    color: "#a78bfa",
  },
  {
    num: "05",
    title: "Decision",
    desc: "Rich object. Full explanation.",
    code: `{ allowed: true, reason }`,
    color: "#c4b5fd",
  },
];

const explainItems = [
  {
    icon: "✓",
    text: "Matched permissions with source tracking",
    color: "#10b981",
  },
  {
    icon: "!",
    text: "Missing permissions clearly identified",
    color: "#f59e0b",
  },
  { icon: "→", text: "Role expansion tracked automatically", color: "#818cf8" },
  {
    icon: "⚡",
    text: "Feature flags use the same unified API",
    color: "#a78bfa",
  },
] as const;

const features = [
  { label: "Any Backend", icon: "🔌", desc: "Normalize any API shape" },
  { label: "Explain Engine", icon: "🔍", desc: "Full decision diagnostics" },
  { label: "Type Safe", icon: "🛡️", desc: "End-to-end TypeScript" },
  { label: "Tree-shakeable", icon: "⚡", desc: "~5kB gzip, zero deps" },
  { label: "SSR Ready", icon: "⚛️", desc: "Next.js & RSC compatible" },
];

const backendList = [
  "Laravel",
  "NestJS",
  "ASP.NET Core",
  "Express",
  "Django REST",
  "Any custom API",
];

const trustItems = [
  "Open Source",
  "MIT License",
  "Zero Dependencies",
  "TypeScript Native",
];

const diagItems = [
  {
    allowed: true,
    label: "Dashboard",
    perm: "pages.dashboard",
    desc: "Matched via direct permission",
  },
  {
    allowed: true,
    label: "Create User",
    perm: "users.create",
    desc: "Matched via direct permission",
  },
  {
    allowed: false,
    label: "System Settings",
    perm: "settings.manage",
    desc: "Missing: settings.manage",
  },
] as const;

/*
   Arrow Component
    */
function FlowArrow({
  active = true,
  vertical = false,
}: {
  active?: boolean;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="flex items-center justify-center py-1">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 0 L8 18"
            stroke={active ? "#6366f1" : "#3a3a42"}
            strokeWidth="1.5"
            strokeLinecap="round"
            className={active ? "animated-arrow-pulse" : ""}
          />
          <path
            d="M4 14 L8 20 L12 14"
            stroke={active ? "#6366f1" : "#3a3a42"}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 px-2">
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
        <path
          d="M0 8 H26"
          stroke={active ? "#6366f1" : "#3a3a42"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className={active ? "animated-arrow-pulse" : ""}
        />
        <path
          d="M22 4 L28 8 L22 12"
          stroke={active ? "#6366f1" : "#3a3a42"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/*
   Main Page
    */
export default function HomePage() {
  const [activeBackend, setActiveBackend] = useState(0);
  const [ctaCopied, setCtaCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setCtaCopied(true);
    setTimeout(() => setCtaCopied(false), 1800);
  };

  return (
    <div className="bg-canvas min-h-screen">
      <HeroSection />

      {/* 
          FEATURE BAR
           */}
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

      {/* 
          HOW IT WORKS
           */}
      <section className="section-py border-b border-border">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-20">
            <div className="section-label">Architecture</div>
            <h2 className="section-heading max-w-[560px]">
              How Accessly works
            </h2>
            <p className="section-body text-center mt-4 max-w-[480px]">
              A transparent pipeline from API response to gated UI — every step
              is observable.
            </p>
          </div>

          {/* 5-step horizontal timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-border)_10%,var(--color-border)_90%,transparent)] z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="card-base card-glow flex flex-col gap-4 p-6 relative"
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
            <div className="lg:col-span-3 panel-dark overflow-hidden flex flex-col">
              <div className="panel-header">
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
            <div className="lg:col-span-2 card-base flex flex-col p-8 gap-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-dark mb-3">
                  Why this matters
                </div>
                <h3 className="section-heading-sm">Transparent by design</h3>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                Authorization decisions affect every user's experience. Accessly
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

      {/* 
          EVERYTHING YOU NEED — BENTO GRID
           */}
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
                Source tracked as <code>checkedFrom: "role"</code>.
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
                <code className="text-[10px]">&lt;Can flag='beta'&gt;</code>{" "}
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

      {/* 
          YOUR BACKEND, ANY SHAPE
           */}
      <section className="section-py border-b border-border">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: heading + description */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="section-label inline-flex">Integration</div>
                <h2 className="section-heading mt-4">
                  Your backend,
                  <br />
                  any shape
                </h2>
              </div>
              <p className="text-[15px] text-muted leading-relaxed max-w-[460px]">
                Every API returns permissions differently. Laravel uses arrays.
                NestJS uses abilities. ASP.NET uses claims. Accessly normalizes
                all of them into one consistent model.
              </p>
              <ul className="flex flex-col gap-2.5 list-none">
                {backendList.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                    <span className="text-sm text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: tabs + panels */}
            <div className="flex flex-col gap-4">
              {/* Selector tabs */}
              <div className="flex flex-wrap gap-2">
                {backendAdapters.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveBackend(idx)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                      activeBackend === idx
                        ? "border border-primary/40 bg-primary/10 text-accent"
                        : "border border-border bg-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Stacked panels with arrows */}
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    title: "Backend Response",
                    code: backendAdapters[activeBackend].response,
                    accent: "text-muted",
                  },
                  {
                    title: "Accessly Adapter",
                    code: backendAdapters[activeBackend].adapter,
                    accent: "text-accent-foreground",
                  },
                  {
                    title: "Unified AccessModel",
                    code: backendAdapters[activeBackend].model,
                    accent: "text-success",
                  },
                ].map((panel, idx) => (
                  <div key={panel.title}>
                    <div className="panel-dark overflow-hidden">
                      <div className="panel-header">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.05em] ${panel.accent}`}
                        >
                          {panel.title}
                        </span>
                      </div>
                      <pre className="m-0 p-3.5 text-[11px] font-mono leading-relaxed text-foreground/65 overflow-auto max-h-[140px]">
                        {panel.code}
                      </pre>
                    </div>
                    {idx < 2 && <FlowArrow vertical />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
          DECISION INSPECTOR
           */}
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

      {/* 
          BOTTOM CTA
           */}
      <section className="section-py !pb-[160px] relative overflow-hidden">
        {/* Subtle radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.07)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center gap-8">
          <div>
            <h2 className="section-heading text-[clamp(36px,5vw,64px)] max-w-[640px] mx-auto mb-4">
              Ready to simplify
              <br />
              access control?
            </h2>
            <p className="section-body text-center mx-auto max-w-[440px]">
              No install required. Test against your backend in the interactive
              lab — then copy the generated code directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/lab" className="btn-primary text-[15px] py-3.5 px-7">
              Open Accessly Lab
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3l5 5-5 5" />
              </svg>
            </Link>
            <button
              onClick={handleCopy}
              className="btn-secondary font-mono text-sm py-3.5 px-7"
            >
              <span className="text-primary font-bold">$</span>
              {ctaCopied ? "Copied!" : "pnpm add accessly"}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-6 border-t border-border w-full max-w-[640px]">
            {trustItems.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs text-muted"
              >
                <span className="text-primary">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
