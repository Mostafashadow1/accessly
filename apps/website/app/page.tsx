"use client";

import { useState } from "react";
import Link from "next/link";

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

const stats = [
  { val: "~5kB", label: "gzip bundle" },
  { val: "0", label: "dependencies" },
  { val: "100%", label: "TypeScript" },
  { val: "MIT", label: "open source" },
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
  const [activePlayTab, setActivePlayTab] = useState(1);
  const [activeBackend, setActiveBackend] = useState(0);
  const [ctaCopied, setCtaCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setCtaCopied(true);
    setTimeout(() => setCtaCopied(false), 1800);
  };

  const playData = (() => {
    switch (activePlayTab) {
      case 0:
        return {
          label: "Dashboard",
          check: "public route",
          allowed: true,
          decision: `{ "allowed": true, "reason": "public_route" }`,
          desc: "Route public · rendering allowed",
        };
      case 2:
        return {
          label: "System Settings",
          check: `engine.check("settings.manage")`,
          allowed: false,
          decision: `{
  "allowed": false,
  "reason": "missing_permissions",
  "requested": ["settings.manage"],
  "missing":  ["settings.manage"],
  "checkedFrom": "direct"
}`,
          desc: "Missing: settings.manage",
        };
      default:
        return {
          label: "Create User",
          check: `engine.check("users.create")`,
          allowed: true,
          decision: `{
  "allowed": true,
  "reason": "matched",
  "requested": ["users.create"],
  "matched":   ["users.create"],
  "checkedFrom": "direct"
}`,
          desc: "Matched: users.create",
        };
    }
  })();

  return (
    <div className="bg-canvas min-h-screen">
      {/* 
          HERO
           */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-20 pb-0 overflow-hidden">
        {/* Layered backgrounds */}
        <div className="hero-radial-top" />
        <div className="hero-arc-ring" />
        <div className="absolute inset-0 bg-dot-grid-lg pointer-events-none" />
        <div className="hero-grid-lines" />
        <div className="hero-bottom-fade" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* ── Text block ── */}
          <div className="flex flex-col items-center text-center max-w-[860px] mx-auto pt-8 pb-16">
            {/* Badge */}
            <div className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              v0.1.0 · Open Source · MIT Licensed
            </div>

            {/* Headline — huge, two-line, Vercel-style */}
            <h1 className="font-bold tracking-tight select-none leading-[1.05] mb-8 text-[clamp(52px,8.5vw,96px)] -tracking-[0.04em]">
              <span className="block title-white">Permission checks that</span>
              <span className="block title-brand mt-[0.08em]">
                explain themselves
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] text-muted leading-relaxed text-center max-w-[540px] mx-auto mb-12">
              Every library returns <code>true</code> or{" "}
              <code className="text-danger bg-danger-bg border-danger/20">
                false
              </code>
              . Accessly returns{" "}
              <strong className="text-foreground font-semibold">why</strong> —
              matched rules, missing permissions, and the exact source of every
              decision.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/lab" className="btn-primary">
                Try Accessly Lab
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
              <Link href="/docs" className="btn-secondary">
                Read the Docs
              </Link>
              <button
                onClick={handleCopy}
                className="btn-secondary font-mono text-[13px]"
              >
                <span className="text-primary font-bold">$</span>
                {ctaCopied ? "Copied!" : "pnpm add accessly"}
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-7 border-t border-border">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="font-bold text-[22px] text-foreground -tracking-[0.03em]">
                    {s.val}
                  </span>
                  <span className="text-[11px] text-muted uppercase tracking-[0.06em] font-medium">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Live Pipeline Playground ── */}
          <div className="relative -mb-0.5">
            {/* Glow behind playground */}
            <div className="absolute inset-[40px_-40px_-40px] bg-[radial-gradient(ellipse_at_50%_80%,rgba(99,102,241,0.08)_0%,transparent_65%)] pointer-events-none" />

            <div className="panel-dark relative overflow-hidden rounded-[18px]">
              {/* Window chrome */}
              <div className="panel-header !rounded-t-[18px]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-danger/70" />
                    <span className="w-3 h-3 rounded-full bg-warning/70" />
                    <span className="w-3 h-3 rounded-full bg-success/70" />
                  </div>
                  <span className="font-mono text-[11px] text-muted ml-2">
                    accessly — live execution pipeline
                  </span>
                </div>
                <span className="font-mono hidden sm:block text-[10px] text-muted-dark">
                  Click a route to trace the decision →
                </span>
              </div>

              {/* Playground body: responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr_1fr] min-h-[360px]">
                {/* Col 1 — Sidebar */}
                <div className="flex flex-col border-b md:border-b-0 md:border-r border-border bg-[rgba(8,8,10,0.6)] p-4 md:p-5">
                  {/* App header */}
                  <div className="flex items-center gap-2 mb-5 px-1.5">
                    <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-primary to-violet flex items-center justify-center text-[9px] font-extrabold text-white shrink-0">
                      A
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      MyApp
                    </span>
                  </div>

                  {/* Nav items */}
                  <div className="flex flex-col gap-0.5 flex-1">
                    {[
                      { label: "Dashboard", id: 0, icon: "◻" },
                      {
                        label: "Create User",
                        id: 1,
                        icon: "◻",
                        badge: "users.create",
                      },
                      {
                        label: "System Settings",
                        id: 2,
                        icon: "◻",
                        badge: "settings.manage",
                        danger: true,
                      },
                    ].map((item) => {
                      const isActive = activePlayTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActivePlayTab(item.id)}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs w-full text-left cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-primary/8 border border-primary/15 text-foreground font-semibold"
                              : "border border-transparent text-muted font-normal hover:text-foreground"
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1 py-[1px] rounded border ${item.danger ? "text-danger border-danger/20 bg-danger/5" : "text-accent-foreground border-primary/20 bg-primary/5"}`}
                            >
                              {item.danger ? "denied" : "gated"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* User chip */}
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border-light bg-white/[0.02] mt-3">
                    <div className="w-[26px] h-[26px] rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-accent-foreground shrink-0">
                      S
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-foreground leading-tight">
                        Sarah
                      </div>
                      <div className="text-[9px] text-muted font-mono">
                        role: editor
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2 — Unified Model */}
                <div className="flex flex-col gap-3 p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
                  <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    01 / AccessModel
                  </div>
                  <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-3 md:p-3.5 border border-border-light overflow-auto">{`{
  "user": {
    "name": "Sarah",
    "id": "usr_99"
  },
  "permissions": [
    "users.create",
    "users.view"
  ],
  "roles": ["editor"]
}`}</pre>
                </div>

                {/* Col 3 — Engine Check */}
                <div className="flex flex-col gap-3 p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
                  <div className="text-[10px] font-mono text-accent-foreground uppercase tracking-widest">
                    02 / Engine
                  </div>
                  <div className="flex-1 bg-black/30 rounded-lg p-3 md:p-3.5 border border-border-light flex flex-col gap-2">
                    <div className="text-[10px] font-mono text-muted">
                      checking:
                    </div>
                    <code className="block text-[11px] px-2.5 py-1.5 bg-primary/7 rounded-md border border-primary/15 text-accent font-mono">
                      {playData.check}
                    </code>
                    <div className="mt-1 text-[10px] font-mono text-muted">
                      strategy:{" "}
                      <span className="text-accent-foreground">
                        direct + role_expansion
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 4 — Decision Output */}
                <div className="flex flex-col gap-3 p-4 md:p-5">
                  <div
                    className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: playData.allowed ? "#10b981" : "#ef4444" }}
                  >
                    03 / Decision {playData.allowed ? "✓" : "✕"}
                  </div>
                  <pre
                    className="m-0 flex-1 text-[11px] font-mono leading-relaxed rounded-lg p-3 md:p-3.5 border overflow-auto"
                    style={{
                      color: playData.allowed
                        ? "rgba(16,185,129,0.85)"
                        : "rgba(239,68,68,0.85)",
                      background: playData.allowed
                        ? "rgba(16,185,129,0.04)"
                        : "rgba(239,68,68,0.04)",
                      borderColor: playData.allowed
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    }}
                  >
                    {playData.decision}
                  </pre>

                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                    style={{
                      borderColor: playData.allowed
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(239,68,68,0.2)",
                      background: playData.allowed
                        ? "rgba(16,185,129,0.05)"
                        : "rgba(239,68,68,0.05)",
                    }}
                  >
                    <span
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: playData.allowed
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(239,68,68,0.12)",
                        color: playData.allowed ? "#10b981" : "#ef4444",
                      }}
                    >
                      {playData.allowed ? "✓" : "✕"}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-foreground leading-tight">
                        {playData.label}
                      </div>
                      <div className="text-[10px] text-muted font-mono">
                        {playData.desc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
