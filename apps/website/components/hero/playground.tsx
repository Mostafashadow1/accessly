"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface BackendData {
  id: string;
  label: string;
  response: string;
  adapter: string;
  model: string;
}

/* ═══════════════════════════════════════════════════════════════
   Static data
   ═══════════════════════════════════════════════════════════════ */

const backends: BackendData[] = [
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
  user: { id: src.id, name: src.name }
}))`,
    model: `{
  "permissions": [
    "posts.create",
    "posts.delete",
    "users.view"
  ],
  "user": { "id": 1, "name": "Alex Admin" }
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
  "permissions": ["read:articles","write:articles"],
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
    { "type": "permission", "value": "billing.read" },
    { "type": "permission", "value": "billing.write" }
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
  "permissions": ["billing.read","billing.write"],
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
  "scopes": ["admin:dashboard","user:edit"]
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.scopes,
  user: { id: src.user.id }
}))`,
    model: `{
  "permissions": ["admin:dashboard","user:edit"],
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
    "grants": ["view_dashboard","edit_profile"]
  }
}`,
    adapter: `createAdapter((src) => ({
  permissions: src.body.grants
    .map(g => g.replace(/_/, ".")),
  user: { id: src.body.profile.uuid }
}))`,
    model: `{
  "permissions": ["view.dashboard","edit.profile"],
  "user": { "id": "u-873" }
}`,
  },
];

const sidebarItems = [
  { label: "Playground", icon: "▶", active: true },
  { label: "Adapters", icon: "◈", active: false },
  { label: "AccessModel", icon: "◉", active: false },
  { label: "Inspector", icon: "◎", active: false },
  { label: "Permission Explorer", icon: "◐", active: false },
  { label: "Logs", icon: "☰", active: false },
] as const;

const features = [
  { label: "Any Backend", icon: "🔌" },
  { label: "Explain Engine", icon: "🔍" },
  { label: "Type Safe", icon: "🛡️" },
  { label: "Tree-shakeable", icon: "⚡" },
  { label: "SSR Ready", icon: "⚛️" },
] as const;

const decision = {
  allowed: true,
  permission: "posts.create",
  reason: "matched",
  matchedBy: "direct permission",
  checkedFrom: "direct",
  timestamp: "2026-06-26T11:39:00.000Z",
};

/* ═══════════════════════════════════════════════════════════════
   PipelineArrow — subtle chevron between pipeline panels
   ═══════════════════════════════════════════════════════════════ */

function PipelineArrow() {
  return (
    <div className="hidden md:flex items-center justify-center shrink-0 text-muted-dark/60">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PipelinePanel — individual step in the pipeline flow
   ═══════════════════════════════════════════════════════════════ */

function PipelinePanel({
  num,
  title,
  accentBorder,
  children,
}: {
  num: string;
  title: string;
  accentBorder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border border-border bg-surface/60 overflow-hidden flex flex-col shadow-sm">
      {/* Colored accent line */}
      <div className={`h-0.5 ${accentBorder}`} />
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50 bg-[rgba(8,8,10,0.3)]">
        <span className="text-[9px] font-mono text-muted-dark font-semibold tracking-wider bg-surface/40 px-1.5 py-0.5 rounded">
          {num}
        </span>
        <span className="text-[11px] font-semibold text-foreground truncate">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Playground — interactive live pipeline embedded in the hero
   ═══════════════════════════════════════════════════════════════ */

export function Playground() {
  const [backendIdx, setBackendIdx] = useState(0);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const backend = backends[backendIdx];

  const handleSend = () => {
    setSending(true);
    setTimeout(() => setSending(false), 700);
  };

  return (
    <div className="relative max-w-[1160px] mx-auto">
      {/* Soft purple edge glow */}
      <div className="absolute -inset-x-8 -inset-y-6 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_60%)] pointer-events-none" />

      {/* ── App container ── */}
      <div className="relative rounded-2xl border border-border bg-surface/70 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* ─── Toolbar ─── */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border bg-[rgba(10,10,13,0.9)]">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Window dots (desktop) */}
            <div className="hidden sm:flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger/70" />
              <span className="w-3 h-3 rounded-full bg-warning/70" />
              <span className="w-3 h-3 rounded-full bg-success/70" />
            </div>
            {/* Title */}
            <span className="text-sm font-semibold text-foreground ml-0 sm:ml-1">
              Live Playground
            </span>
            {/* Live indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-success font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
              live
            </span>
          </div>

          {/* Right side toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Backend selector */}
            <div className="relative">
              <select
                value={backendIdx}
                onChange={(e) => {
                  setBackendIdx(Number(e.target.value));
                  setSending(false);
                }}
                className="appearance-none bg-surface border border-border rounded-lg px-3 py-1.5 pr-7 text-[11px] font-mono font-medium text-foreground cursor-pointer outline-none focus:border-primary/40 transition-colors"
              >
                {backends.map((b, i) => (
                  <option key={b.id} value={i}>
                    {b.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none text-[9px]">
                ▾
              </span>
            </div>

            {/* Send Request button */}
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-br from-primary to-violet shadow-sm shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {sending ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 1L9 15l-3-7L1 7z" />
                  </svg>
                  Send Request
                </>
              )}
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Body: sidebar + content ─── */}
        <div className="flex">
          {/* ─── Sidebar ─── */}
          <aside
            className={`${
              sidebarOpen ? "block" : "hidden"
            } md:flex flex-col w-[190px] shrink-0 border-r border-border bg-[rgba(8,8,10,0.6)] p-3 gap-0.5`}
          >
            {/* Logo area */}
            <div className="flex items-center gap-2.5 px-2.5 py-3.5 mb-3 border-b border-border">
              <span className="w-5 h-5 rounded-[7px] bg-gradient-to-br from-primary to-violet flex items-center justify-center text-[9px] font-extrabold text-white shrink-0 shadow-sm shadow-primary/30">
                A
              </span>
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Accessly
              </span>
              <span className="ml-auto text-[9px] text-muted-dark font-mono">
                v0.1.0
              </span>
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-0.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-all duration-150 ${
                    item.active
                      ? "bg-primary/8 border border-primary/15 text-foreground font-semibold"
                      : "border border-transparent text-muted font-normal hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <span
                    className={`text-[10px] ${
                      item.active ? "text-accent" : "text-muted-dark"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Bottom status */}
            <div className="mt-auto pt-5 px-2.5">
              <div className="flex items-center gap-2 text-[10px] text-muted-dark font-mono border-t border-border pt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-success/60 animate-pulse-live" />
                connected
              </div>
            </div>
          </aside>

          {/* ─── Pipeline content ─── */}
          <div className="flex-1 p-4 md:p-5 lg:p-6 overflow-hidden">
            {/* Pipeline panels row — flex on desktop, wraps on small screens */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
              {/* 1. Backend Response */}
              <PipelinePanel
                num="01"
                title="Backend Response"
                accentBorder="bg-muted-dark"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  Raw API output
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.response}
                </pre>
              </PipelinePanel>

              <PipelineArrow />

              {/* 2. Adapter */}
              <PipelinePanel
                num="02"
                title="Adapter"
                accentBorder="bg-accent-foreground/50"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  normalize
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.adapter}
                </pre>
              </PipelinePanel>

              <PipelineArrow />

              {/* 3. AccessModel */}
              <PipelinePanel
                num="03"
                title="AccessModel"
                accentBorder="bg-success/50"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2">
                  unified schema
                </div>
                <pre className="m-0 flex-1 text-[11px] font-mono leading-relaxed text-foreground/65 bg-black/30 rounded-lg p-2.5 border border-border-light overflow-auto whitespace-pre">
                  {backend.model}
                </pre>
              </PipelinePanel>

              <PipelineArrow />

              {/* 4. Decision */}
              <PipelinePanel
                num="04"
                title="Decision"
                accentBorder={
                  decision.allowed ? "bg-success/50" : "bg-danger/50"
                }
              >
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${
                      decision.allowed
                        ? "text-success bg-success/6 border-success/15"
                        : "text-danger bg-danger/6 border-danger/15"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        decision.allowed ? "bg-success" : "bg-danger"
                      }`}
                    />
                    {decision.allowed ? "Allowed" : "Denied"}
                  </span>
                </div>

                {/* Permission */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-1">
                    Permission
                  </div>
                  <code className="block text-[11px] font-mono text-accent bg-primary/7 rounded-md px-2 py-1 border border-primary/15">
                    engine.check(&quot;{decision.permission}&quot;)
                  </code>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">reason</span>
                    <span className="text-success font-mono font-medium">
                      {decision.reason}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">matched by</span>
                    <span className="text-foreground font-mono">
                      {decision.matchedBy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">source</span>
                    <span className="text-foreground/60 font-mono">
                      {decision.checkedFrom}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-dark font-mono">time</span>
                    <span className="text-foreground/40 font-mono text-[9px]">
                      {decision.timestamp}
                    </span>
                  </div>
                </div>
              </PipelinePanel>

              <PipelineArrow />

              {/* 5. UI Preview */}
              <PipelinePanel
                num="05"
                title="UI Preview"
                accentBorder="bg-primary/50"
              >
                <div className="text-[9px] font-mono text-muted-dark uppercase tracking-wider mb-2.5">
                  rendered UI
                </div>

                <div className="flex-1 bg-black/30 rounded-xl border border-border-light p-3 flex flex-col gap-2.5">
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center text-[9px] font-bold text-accent border border-primary/10">
                        +
                      </div>
                      <span className="text-[11px] font-semibold text-foreground">
                        Create Post
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md border ${
                        decision.allowed
                          ? "text-success bg-success/6 border-success/15"
                          : "text-danger bg-danger/6 border-danger/15"
                      }`}
                    >
                      {decision.allowed ? "enabled" : "denied"}
                    </span>
                  </div>

                  {/* Simulated form field */}
                  <div className="h-6 rounded-md bg-white/[0.04] border border-border-light" />

                  {/* Action button */}
                  <button
                    className={`w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                      decision.allowed
                        ? "bg-gradient-to-r from-primary to-violet text-white shadow-sm shadow-primary/20"
                        : "bg-surface-2 text-muted-dark cursor-not-allowed border border-border"
                    }`}
                  >
                    {decision.allowed ? "Publish Post" : "Create Post"}
                  </button>

                  {/* Explanation */}
                  <p className="text-[9px] text-muted leading-relaxed">
                    {decision.allowed
                      ? "You have permission to create posts. The button is fully interactive."
                      : "Missing permission: posts.create. The action is unavailable."}
                  </p>
                </div>
              </PipelinePanel>
            </div>

            {/* ─── Bottom feature strip ─── */}
            <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-5 border-t border-border">
              {features.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium text-muted bg-surface border border-border hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.02] transition-all duration-200"
                >
                  <span className="text-[12px]">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
