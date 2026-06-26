"use client";

import { useState } from "react";
import { PermissionProvider } from "accessly";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const adapters = [
  {
    id: "laravel",
    label: "Laravel",
    response: `{
  "id": 1,
  "name": "admin",
  "permissions": [
    "pages.dashboard",
    "users.create",
    "reports.view"
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.permissions,
  user: { id: src.id, roles: [src.name] },
}))`,
    model: `{
  "user": { "id": 1, "roles": ["admin"] },
  "permissions": [
    "pages.dashboard",
    "users.create",
    "reports.view"
  ]
}`,
  },
  {
    id: "nestjs",
    label: "NestJS",
    response: `{
  "user": {
    "userId": "usr_abc123",
    "role": "editor",
    "scopes": ["write:users", "read:reports"]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.user.scopes,
  user: { id: src.user.userId, roles: [src.user.role] },
}))`,
    model: `{
  "user": { "id": "usr_abc123", "roles": ["editor"] },
  "permissions": ["write:users", "read:reports"]
}`,
  },
  {
    id: "aspnet",
    label: "ASP.NET",
    response: `{
  "claims": [
    { "type": "permission", "value": "pages.dashboard" },
    { "type": "permission", "value": "users.delete" },
    { "type": "role", "value": "admin" }
  ]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.claims
    .filter(c => c.type === "role")
    .map(c => c.value),
}))`,
    model: `{
  "permissions": ["pages.dashboard", "users.delete"],
  "roles": ["admin"]
}`,
  },
  {
    id: "express",
    label: "Express",
    response: `{
  "session": {
    "user": { "id": 42 },
    "acl": {
      "dashboard": true,
      "users": { "create": true, "delete": false }
    }
  }
}`,
    adapter: `createAdapter((src) => ({
  user: { id: src.session.user.id },
  permissions: Object.entries(src.session.acl)
    .reduce((acc, [k, v]) => {
      if (typeof v === "boolean" && v) acc.push(k);
      if (typeof v === "object")
        Object.entries(v).forEach(
          ([sk, sv]) => sv && acc.push(\`\${k}.\${sk}\`)
        );
      return acc;
    }, []),
}))`,
    model: `{
  "user": { "id": 42 },
  "permissions": ["dashboard", "users.create"]
}`,
  },
  {
    id: "custom",
    label: "Custom",
    response: `{
  "data": {
    "access": {
      "can": ["view_dashboard", "manage_users"],
      "level": "full"
    },
    "profile": { "uid": "u_99" }
  }
}`,
    adapter: `createAdapter((src) => ({
  user: { id: src.data.profile.uid },
  permissions: src.data.access.can.map(
    p => p.replace(/_/, ".")
  ),
}))`,
    model: `{
  "user": { "id": "u_99" },
  "permissions": ["view.dashboard", "manage.users"]
}`,
  },
];

const pipelineSteps = [
  {
    num: "01",
    title: "Backend Response",
    desc: "Your API returns permissions in any shape.",
    code: `{ "permissions": ["users.create"] }`,
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
  },
  {
    num: "02",
    title: "Adapter",
    desc: "One adapter normalizes any backend.",
    code: `createAdapter(src => ({ permissions: src.permissions }))`,
    color: "from-violet/20 to-violet/5",
    border: "border-violet/20",
  },
  {
    num: "03",
    title: "AccessModel",
    desc: "Unified permission model, any source.",
    code: `{ permissions: ["users.create"] }`,
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
  },
  {
    num: "04",
    title: "Engine",
    desc: "Match, expand roles, check flags.",
    code: `engine.check("users.create")`,
    color: "from-violet/20 to-violet/5",
    border: "border-violet/20",
  },
  {
    num: "05",
    title: "Decision",
    desc: "Full explainable decision object.",
    code: `{ allowed: true, reason: "matched" }`,
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
  },
];

const heroStages = [
  {
    id: "backend",
    title: "Backend Response",
    subtitle: "Your API in any shape",
    code: `{ "permissions": ["users.create"] }`,
    accent: "border-l-primary",
  },
  {
    id: "adapter",
    title: "Adapter",
    subtitle: "Normalize once",
    code: `createAdapter(src => ({ permissions: src.permissions }))`,
    accent: "border-l-violet",
  },
  {
    id: "model",
    title: "AccessModel",
    subtitle: "Unified format",
    code: `{ "permissions": ["users.create"] }`,
    accent: "border-l-primary",
  },
  {
    id: "engine",
    title: "Engine",
    subtitle: "Match & explain",
    code: `engine.check("users.create")`,
    accent: "border-l-violet",
  },
  {
    id: "decision",
    title: "Decision",
    subtitle: "Full explanation",
    code: `{ allowed: true, reason: "matched" }`,
    accent: "border-l-primary",
  },
];

const bentoItems = [
  {
    id: "explain",
    title: "Explain Engine",
    description:
      "Every check returns a full decision — matched rules, missing permissions, and why.",
    span: "lg",
    icon: "🔍",
    gradient: "from-primary/10 via-primary/5 to-transparent",
    preview: `{
  allowed: true,
  reason: "matched",
  matched: ["users.create"],
  missing: undefined,
  checkedFrom: "direct"
}`,
  },
  {
    id: "adapters",
    title: "Backend Adapters",
    description:
      "Laravel, NestJS, Express, Django — any backend normalizes into one AccessModel.",
    span: "md",
    icon: "🔌",
    gradient: "from-violet/10 via-violet/5 to-transparent",
  },
  {
    id: "components",
    title: "Components + Hooks",
    description:
      "Use <Can>, usePermission(), or <ProtectedRoute> — same engine, any pattern.",
    span: "sm",
    icon: "🧩",
    gradient: "from-primary/10 via-transparent to-transparent",
  },
  {
    id: "rbac",
    title: "RBAC + Role Expansion",
    description:
      "Role-to-permission maps auto-expand. Tracked with checkedFrom: 'role'.",
    span: "sm",
    icon: "🛡️",
    gradient: "from-primary/5 to-transparent",
  },
  {
    id: "flags",
    title: "Feature Flags",
    description:
      "Built-in flag support with the same API — <Can permission={{ flag: 'beta' }}>.",
    span: "sm",
    icon: "🚩",
    gradient: "from-violet/5 to-transparent",
  },
  {
    id: "nav",
    title: "Navigation Filtering",
    description:
      "Filter sidebar items automatically. Nested items, recursive, zero boilerplate.",
    span: "lg",
    icon: "🌀",
    gradient: "from-primary/10 via-primary/5 to-transparent",
    preview: `// Before                      // After
[                              [
  { label: "Dashboard" },        { label: "Dashboard" },
  { label: "Settings",    →      { label: "Users" },
    permission: "settings" },   ]
  { label: "Users",
    permission: "users" },
]`,
  },
  {
    id: "debug",
    title: "Debug Tools",
    description:
      "formatDecision() and inspectAccess() output human-readable permission diagnostics.",
    span: "sm",
    icon: "🐞",
    gradient: "from-primary/5 to-transparent",
  },
  {
    id: "typescript",
    title: "TypeScript + Tree Shakeable",
    description:
      "Full types. ~5kB gzip. ESM + CJS. Zero external deps. Import only what you use.",
    span: "md",
    icon: "⚡",
    gradient: "from-violet/10 via-violet/5 to-transparent",
  },
];

const features = [
  { label: "Any Backend", icon: "🔌" },
  { label: "Explain Engine", icon: "🔍" },
  { label: "Type Safe", icon: "🛡️" },
  { label: "Tree-shakeable", icon: "⚡" },
  { label: "SSR Ready", icon: "⚛️" },
];

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function HomePage() {
  const [activeAdapter, setActiveAdapter] = useState(0);
  const [installCopied, setInstallCopied] = useState(false);
  const exampleAccess = {
    permissions: ["users.create", "users.delete", "pages.dashboard"],
  };

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("pnpm add accessly");
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 1500);
  };

  return (
    <div className="bg-canvas">
      {/* ═══════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dot-grid-lg opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-primary/4 via-primary/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-primary-light border border-primary/20 mb-8">
              v0.1.0 · Open Source · MIT
            </span>

            {/* Headline — refined, premium gradient treatment */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="block bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent pb-0.5">
                Permission checks that
              </span>
              <span className="block mt-0.5 bg-gradient-to-r from-indigo-300 via-primary to-violet bg-clip-text text-transparent">
                explain themselves
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10">
              Every other library returns <code className="text-accent">true</code> or{" "}
              <code className="text-danger">false</code>. Accessly returns{" "}
              <em className="text-foreground not-italic font-semibold">why</em> — with
              matched rules, missing permissions, and the exact source of every decision.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap justify-center mb-20">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-violet shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
              >
                Try Accessly Lab
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l5 5-5 5" />
                </svg>
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-foreground border border-border hover:border-foreground/20 hover:bg-surface-hover transition-all duration-200"
              >
                Read the Docs
              </Link>
            </div>
          </div>

          {/* ── Pipeline Playground ── */}
          <div className="relative rounded-2xl border border-border bg-surface/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-surface/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Pipeline Playground
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-dark ml-auto hidden sm:block">
                /* backend → adapter → model → engine → decision */
              </span>
            </div>

            {/* Stages */}
            <div className="flex flex-col lg:flex-row items-stretch gap-3 p-4 lg:p-5">
              {heroStages.map((stage, i) => (
                <div key={stage.id} className="flex-1 flex flex-col lg:flex-row items-stretch gap-0">
                  <div className={`flex-1 rounded-xl border border-border-light bg-surface p-3.5 hover:border-primary/20 transition-all duration-200`}>
                    {/* Top: number + title */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-primary/50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs font-semibold text-foreground">{stage.title}</span>
                    </div>
                    {/* Subtitle */}
                    <p className="text-[11px] text-muted mb-2">{stage.subtitle}</p>
                    {/* Code */}
                    <pre className="m-0 text-[11px] font-mono text-foreground/70 bg-black/30 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap">
                      <code>{stage.code}</code>
                    </pre>
                  </div>
                  {/* Arrow connector (desktop) */}
                  {i < heroStages.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-6 shrink-0 self-stretch">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-dark">
                        <path d="M7 4l6 6-6 6" />
                      </svg>
                    </div>
                  )}
                  {/* Arrow connector (mobile - down) */}
                  {i < heroStages.length - 1 && (
                    <div className="flex lg:hidden items-center justify-center h-5 text-muted-dark">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURE BAR
          ═══════════════════════════════════════════════ */}
      <section className="border-y border-border bg-surface/30">
        <div className="max-w-5xl mx-auto px-6 py-6 md:py-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {features.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-surface text-muted border border-border hover:border-primary/20 hover:text-foreground transition-colors"
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — PIPELINE
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-primary-light border border-primary/20 mb-5">
              Pipeline
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              How Accessly works
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The full pipeline from backend response to UI decision. Every step is
              transparent and explainable.
            </p>
          </div>

          {/* Timeline — horizontal on desktop, vertical on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
            {pipelineSteps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className={`rounded-xl bg-surface border ${step.border} p-5 h-full hover:border-primary/30 transition-colors`}>
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} text-xs font-bold text-accent`}>
                      {step.num}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground m-0">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-3">{step.desc}</p>
                  <pre className="m-0 text-xs font-mono text-foreground/70 bg-black/30 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                    <code>{step.code}</code>
                  </pre>
                </div>
                {/* Connector line (desktop) */}
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-10 w-6 text-muted-dark">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Full Code Example + Explanation — split layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 rounded-xl border border-border bg-black/50 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Full Example
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed text-foreground overflow-auto">
                <pre className="m-0 whitespace-pre-wrap text-sm">{`// 1. Backend Response (any shape)
const apiResponse = {
  permissions: ["pages.dashboard", "users.create"],
  roles: ["admin"],
  user: { id: 1, name: "Admin" }
};

// 2. Adapter (normalize once)
const adapter = createAdapter((src) => ({
  permissions: src.permissions,
  roles: src.roles,
  user: src.user
}));

// 3. Wrap your app
<PermissionProvider source={apiResponse} adapter={adapter}>
  <App />
</PermissionProvider>

// 4. Gate anything — component, hook, route
<Can permission="users.create">
  <CreateUserButton />
</Can>

// 5. Full decision object
const decision = usePermission("users.create");
// → { allowed: true, reason: "matched",
//     matched: ["users.create"],
//     checkedFrom: "direct" }`}</pre>
              </div>
            </div>
            <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-6 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-dark mb-3">Why this matters</span>
              <h3 className="text-lg font-bold text-foreground mb-3">Transparent by design</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Every permission check returns a full decision object — not just{" "}
                <code className="text-accent">true</code>/<code className="text-danger">false</code>.
                You always know <em className="text-foreground not-italic font-medium">why</em> access
                was granted or denied.
              </p>
              <ul className="space-y-2 m-0 p-0 list-none">
                <li className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-success mt-0.5">✓</span>
                  Matched permissions with source tracking
                </li>
                <li className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-warning mt-0.5">!</span>
                  Missing permissions clearly identified
                </li>
                <li className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-accent mt-0.5">→</span>
                  Role expansion and flag support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          EVERYTHING YOU NEED — BENTO GRID
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-primary-light border border-primary/20 mb-5">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Production-grade access control for React. Zero boilerplate, maximum clarity.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bentoItems.map((item) => {
              const isLg = item.span === "lg";
              const isMd = item.span === "md";
              const colSpan = isLg ? "lg:col-span-2" : "";
              const rowSpan = isLg ? "lg:row-span-2" : "";

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border border-border bg-surface overflow-hidden group transition-all duration-200 hover:border-primary/25 ${colSpan} ${rowSpan}`}
                >
                  <div className={`${isLg ? "p-6" : "p-5"} h-full flex flex-col`}>
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-hover text-base shrink-0">
                        {item.icon}
                      </span>
                      <h3 className={`font-semibold text-foreground m-0 ${isLg ? "text-lg" : "text-sm"}`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className={`text-muted leading-relaxed mb-auto ${isLg ? "text-sm" : "text-xs"}`}>
                      {item.description}
                    </p>

                    {/* Preview code (for items that have it) */}
                    {item.preview && (
                      <div className="mt-4 bg-black/40 rounded-lg p-3 overflow-auto">
                        <pre className="m-0 text-xs font-mono text-foreground/60 whitespace-pre-wrap">
                          <code>{item.preview}</code>
                        </pre>
                      </div>
                    )}

                    {/* Gradient accent bar */}
                    <div className={`h-0.5 w-full rounded-full mt-4 bg-gradient-to-r ${item.gradient}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BACKEND ADAPTERS — INTERACTIVE TABS
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-primary-light border border-primary/20 mb-5">
              Adapters
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Your backend, any shape
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Every backend returns permissions differently. Accessly normalizes them all
              into one model.
            </p>
          </div>

          {/* Tab Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {adapters.map((adapter, i) => (
              <button
                key={adapter.id}
                onClick={() => setActiveAdapter(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeAdapter === i
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface text-muted border border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {adapter.label}
              </button>
            ))}
          </div>

          {/* Adapter Pipeline — 3 columns with arrows */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* Backend Response */}
            <div className="flex-1 rounded-xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-surface-hover flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Backend Response
                </span>
              </div>
              <pre className="p-5 m-0 font-mono text-sm text-foreground leading-relaxed overflow-auto">
                <code>{adapters[activeAdapter].response}</code>
              </pre>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center w-10 shrink-0 text-muted-dark">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex lg:hidden items-center justify-center h-8 text-muted-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>

            {/* Adapter Code */}
            <div className="flex-1 rounded-xl border border-primary/20 bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-primary/20 bg-primary-light/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Adapter
                </span>
              </div>
              <pre className="p-5 m-0 font-mono text-sm text-foreground leading-relaxed overflow-auto">
                <code>{adapters[activeAdapter].adapter}</code>
              </pre>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center w-10 shrink-0 text-muted-dark">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex lg:hidden items-center justify-center h-8 text-muted-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>

            {/* Normalized AccessModel */}
            <div className="flex-1 rounded-xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-surface-hover flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  AccessModel
                </span>
              </div>
              <pre className="p-5 m-0 font-mono text-sm text-foreground leading-relaxed overflow-auto">
                <code>{adapters[activeAdapter].model}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DECISION INSPECTOR
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-primary-light border border-primary/20 mb-5">
              Decisions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Every decision explains itself
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              No more guessing why access was denied. Every check returns the full story.
            </p>
          </div>

          {/* Two-column split */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Terminal-style Decision Object */}
            <div className="rounded-xl border border-border bg-black/60 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface/60">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-xs font-semibold text-muted ml-2 uppercase tracking-wider">
                  Decision Object
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed text-foreground overflow-auto">
                <pre className="m-0 whitespace-pre-wrap">{`{
  "allowed": false,
  "reason": "missing_permissions",
  "requested": ["pages.settings"],
  "matched": [],
  "missing": ["pages.settings"],
  "checkedFrom": "direct",
  "timestamp": "2026-06-26T03:55:21.000Z"
}`}</pre>
              </div>
            </div>

            {/* Human-readable UI Result */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-surface-hover">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Live UI Result
                </span>
              </div>
              <PermissionProvider access={exampleAccess}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-success-bg border border-success/20">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success text-sm">
                      ✓
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-success m-0">Dashboard</p>
                        <span className="text-[10px] font-mono text-success/60">pages.dashboard</span>
                      </div>
                      <p className="text-xs text-muted m-0 mt-0.5">Matched via direct permission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-success-bg border border-success/20">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success text-sm">
                      ✓
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-success m-0">Create User</p>
                        <span className="text-[10px] font-mono text-success/60">users.create</span>
                      </div>
                      <p className="text-xs text-muted m-0 mt-0.5">Matched via direct permission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-danger-bg border border-danger/20">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-danger/20 text-danger text-sm">
                      ✕
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-danger m-0">Settings</p>
                        <span className="text-[10px] font-mono text-danger/60">pages.settings</span>
                      </div>
                      <p className="text-xs text-muted m-0 mt-0.5">Missing: pages.settings</p>
                    </div>
                  </div>
                </div>
              </PermissionProvider>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/3 to-transparent rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 leading-tight">
            Ready to simplify
            <br />
            access control?
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10">
            No install required. Try it with your backend and your permissions right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-violet shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
            >
              Open Accessly Lab
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l5 5-5 5" />
              </svg>
            </Link>
            <button
              onClick={handleCopyInstall}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-foreground border border-border hover:border-primary/30 hover:bg-surface-hover transition-all duration-200 font-mono"
            >
              <span aria-hidden="true" className="text-primary">$</span>
              {installCopied ? "Copied! pnpm add accessly" : "pnpm add accessly"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
