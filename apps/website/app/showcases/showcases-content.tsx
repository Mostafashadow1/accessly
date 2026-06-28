"use client";

import { useState, useMemo, useEffect, useCallback, type ReactNode } from "react";
import {
  PermissionProvider,
  filterNavigation,
  useAccessDecision,
} from "accessly";
import type { NavigationItem, AccessModel } from "accessly";

// ──═ presets ═─────────────────────────────────────────────────────────────
const PRESETS = {
  laravel: {
    name: "Laravel",
    payload: {
      user: { id: "usr_laravel_dev", name: "Alex Dev", roles: ["developer"] },
      all_permissions: ["repositories.read", "repositories.write", "billing.view"],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.all_permissions,
  user: { id: src.user.id, name: src.user.name, roles: src.user.roles },
}))`,
  },
  nestjs: {
    name: "NestJS",
    payload: {
      user: { id: "usr_nest_editor", name: "Sarah Editor", roles: ["editor"] },
      abilities: ["repositories.read", "posts.create", "posts.write"],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.abilities,
  roles: src.user.roles,
  user: { id: src.user.id, name: src.user.name },
}))`,
  },
  aspnet: {
    name: "ASP.NET",
    payload: {
      nameid: "usr_asp_admin", name: "Jordan Admin", role: ["Administrator"],
      claims: [
        { type: "permission", value: "repositories.read" },
        { type: "permission", value: "repositories.write" },
        { type: "permission", value: "repositories.delete" },
        { type: "permission", value: "billing.view" },
        { type: "permission", value: "billing.edit" },
      ],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.role,
  user: { id: src.nameid, name: src.name },
}))`,
  },
  springboot: {
    name: "Spring Boot",
    payload: {
      user: { id: "usr_spring_mgr", name: "Morgan Manager", roles: ["ROLE_MANAGER"] },
      authorities: [
        { authority: "repositories.read" },
        { authority: "repositories.write" },
        { authority: "repositories.delete" },
        { authority: "billing.view" },
        { authority: "settings.manage" },
      ],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.authorities.map((a) => a.authority),
  roles: src.user.roles,
  user: { id: src.user.id, name: src.user.name },
}))`,
  },
  supabase: {
    name: "Supabase",
    payload: {
      user: { id: "usr_super_admin", name: "Charlie Lead", roles: ["admin"] },
      permissions: ["repositories.*", "billing.*", "settings.manage"],
      features: { beta_deployments: true, enterprise_sso: true },
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.permissions,
  flags: Object.entries(src.features ?? {})
    .filter(([_, v]) => v === true)
    .map(([k]) => \`features.\${k}\`),
  roles: src.user.roles,
  user: { id: src.user.id, name: src.user.name },
}))`,
  },
  express: {
    name: "Express",
    payload: {
      user: { id: "usr_exp_api", name: "API Service", roles: ["service"] },
      scope: ["repositories.read", "repositories.write"],
      permissions: ["billing.view"],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: [...(src.scope ?? []), ...(src.permissions ?? [])],
  roles: src.user.roles,
  user: { id: src.user.id, name: src.user.name },
}))`,
  },
  custom: {
    name: "Custom",
    payload: {
      user: { id: "usr_custom_user", name: "Guest User", roles: [] },
      permissions: [],
      features: {},
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.permissions ?? [],
  flags: [],
  user: src.user,
}))`,
  },
};
type PresetKey = keyof typeof PRESETS;

// ──═ pipeline stages ═─────────────────────────────────────────────────────
const PIPELINE = [
  { id: "backend",  icon: "📥",  label: "Backend Response", desc: "Raw JSON payload from your API server" },
  { id: "adapter",  icon: "🔧",  label: "Adapter",          desc: "Backend-agnostic transform" },
  { id: "model",    icon: "📋",  label: "AccessModel",       desc: "Normalized permissions + context" },
  { id: "engine",   icon: "⚡",  label: "Permission Engine", desc: "Rule evaluation engine" },
  { id: "decision", icon: "🎯",  label: "Decision",          desc: "Grant or deny result" },
  { id: "preview",  icon: "🖥️",  label: "UI Preview",        desc: "React components live-gated" },
] as const;
type StageId = (typeof PIPELINE)[number]["id"];

// ──═ mock rows ═───────────────────────────────────────────────────────────
const MOCK_DOCUMENTS = [
  { id: "doc_1", title: "Q3 Sales Financial Forecast", classification: "confidential", ownerId: "usr_asp_admin" },
  { id: "doc_2", title: "Public Product Roadmap & Release Docs", classification: "public", ownerId: "usr_nest_editor" },
  { id: "doc_3", title: "SSO Config Keys & Auth Secrets", classification: "secret", ownerId: "usr_super_admin" },
  { id: "doc_4", title: "API Gateway Codebase Audit", classification: "confidential", ownerId: "usr_laravel_dev" },
  { id: "doc_5", title: "General Security Guidelines V2", classification: "public", ownerId: "usr_asp_admin" },
];

// ──═ helpers ═─────────────────────────────────────────────────────────────
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT — Accessly OS: a live dashboard for permissions experimentation
// ════════════════════════════════════════════════════════════════════════════
export function ShowcasesContent() {
  // ── OS State ──
  const [query, setQuery] = useState("repositories.write");
  const [role, setRole] = useState("developer");
  const [perms, setPerms] = useState<Set<string>>(new Set([
    "repositories.read", "repositories.write", "billing.view", "settings.manage",
  ]));
  const [flags, setFlags] = useState<Set<string>>(new Set(["features.beta_deployments"]));
  const [userName, setUserName] = useState("Alex Dev");
  const [userId] = useState("usr_demo");
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState<PresetKey>("laravel");
  const [jsonText, setJsonText] = useState("");
  const [inspectorQuery, setInspectorQuery] = useState("repositories.write");

  // ── Load preset JSON ──
  useEffect(() => {
    setJsonText(JSON.stringify(PRESETS[preset].payload, null, 2));
  }, [preset]);

  // ── Parse JSON ──
  const parsedJson = useMemo(() => {
    try { return JSON.parse(jsonText); } catch { return null; }
  }, [jsonText]);

  // ── Live AccessModel derived from all toggle state ──
  const liveModel = useMemo<AccessModel>(() => ({
    user: { id: userId, name: userName, roles: [role] },
    permissions: Array.from(perms),
    flags: Array.from(flags),
    isLoading: loading,
  }), [role, perms, flags, userName, userId, loading]);

  // ── Navigation items + pruned view ──
  const navItems: NavigationItem[] = useMemo(() => [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: "User Management", permission: "pages.users",
      children: [
        { label: "List Users", href: "/users", permission: "users.list" },
        { label: "Create Members", href: "/users/new", permission: "users.create" },
      ],
    },
    { label: "Billing Console", href: "/billing", permission: "billing.view" },
    { label: "Security Logs", href: "/settings/security", permission: "settings.manage" },
  ], []);

  const filteredNav = useMemo(() => filterNavigation(navItems, liveModel), [navItems, liveModel]);

  // ── Decision engine trace (live from query + model) ──
  const decision = useMemo(() => {
    const q = inspectorQuery;
    const p = liveModel.permissions ?? [];
    const r = liveModel.user?.roles ?? [];
    const f = liveModel.flags ?? [];

    const direct = p.includes(q);
    const wildcardPatterns = p.filter((p2) => p2.includes("*"));
    const wildcard = wildcardPatterns.some(
      (w) => w === "*" || (w.endsWith(".*") && q.startsWith(w.slice(0, -2)))
    );
    const roleMatch = r.some((r2) => q.startsWith(r2));
    const granted = direct || wildcard || roleMatch;

    const matched = direct
      ? q
      : wildcard
        ? wildcardPatterns.find((w) => w === "*" || (w.endsWith(".*") && q.startsWith(w.slice(0, -2)))) || "—"
        : roleMatch
          ? q
          : "—";

    const source = direct
      ? "permissions[] direct lookup"
      : wildcard
        ? "wildcard expansion"
        : roleMatch
          ? "role-based assignment"
          : "N/A";

    return { q, p, r, f, direct, wildcardPatterns, wildcard, roleMatch, granted, matched, source };
  }, [inspectorQuery, liveModel]);

  // ── Toggle handlers ──
  const togglePerm = useCallback((p: string) => {
    setPerms((prev) => {
      const n = new Set(prev);
      n.has(p) ? n.delete(p) : n.add(p);
      return n;
    });
  }, []);
  const toggleFlag = useCallback((f: string) => {
    setFlags((prev) => {
      const n = new Set(prev);
      n.has(f) ? n.delete(f) : n.add(f);
      return n;
    });
  }, []);

  const ALL_PERMS = [
    "repositories.read", "repositories.write", "repositories.delete",
    "billing.view", "billing.edit", "settings.manage", "users.list", "users.create",
  ] as const;
  const ALL_FLAGS = ["features.beta_deployments", "features.enterprise_sso", "features.audit_logs"] as const;
  const ALL_ROLES = ["admin", "editor", "developer", "viewer", "service"] as const;

  return (
    <PermissionProvider access={liveModel}>
      <div className="min-h-screen bg-canvas text-foreground">
        {/* ─═ Menu Bar ═─ */}
        <div className="sticky top-0 z-40 border-b border-border bg-[rgba(8,8,10,0.92)] backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between h-11 gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-[6px] bg-gradient-to-br from-primary to-violet text-[9px] font-extrabold text-white shadow-sm shadow-primary/30">A</span>
              <span className="text-xs font-bold text-foreground tracking-tight hidden sm:inline">Accessly OS</span>
            </div>
            <div className="flex-1 max-w-md mx-auto relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-dark text-[10px] font-mono pointer-events-none">❯</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full h-7 bg-[#060608] border border-border rounded-lg text-[9px] font-mono text-foreground pl-5 pr-2 focus:outline-none focus:border-primary/50"
                placeholder="check a permission…" />
            </div>
            <div className="flex items-center gap-2 shrink-0 text-[10px] text-muted font-mono">
              <span className="hidden md:inline">{perms.size} perms</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* ─═ Dashboard Grid ═─ */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5">
          {/* Live verdict banner */}
          <div className={cn(
            "mb-4 px-4 py-2.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-2 transition-all duration-300",
            decision.granted ? "bg-success-bg text-success border-success/20" : "bg-danger-bg text-danger border-danger/20"
          )}>
            <span className={cn("w-2 h-2 rounded-full", decision.granted ? "bg-success" : "bg-danger")} />
            <span>AccessDecision("{query}")</span>
            <span className="ml-auto">{decision.granted ? "✓ ALLOWED" : "✗ DENIED"}</span>
            <span className="text-[9px] text-muted-dark font-normal tracking-tight">{decision.source}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* ─═ LEFT: Toolbox ═─ */}
            <div className="lg:col-span-4 space-y-3">
              {/* Role switcher */}
              <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">🎭 Role</span>
                  <span className="text-[7px] text-muted-dark font-mono">{role}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALL_ROLES.map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-semibold border transition-all duration-150 cursor-pointer",
                        role === r
                          ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                          : "bg-surface-2 text-muted border-border hover:text-foreground hover:border-border-hover"
                      )}>{r}</button>
                  ))}
                </div>
              </div>

              {/* Permission toggles */}
              <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">🔑 Permissions</span>
                  <span className="text-[7px] text-muted-dark font-mono">{perms.size} active</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALL_PERMS.map((p) => (
                    <button key={p} onClick={() => togglePerm(p)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all duration-150 cursor-pointer",
                        perms.has(p)
                          ? "bg-success-bg text-success border-success/30"
                          : "bg-surface-2 text-muted-dark border-border/40 hover:text-foreground hover:border-border-hover"
                      )}>{perms.has(p) ? "✓ " : "○ "}{p}</button>
                  ))}
                </div>
              </div>

              {/* Flag toggles */}
              <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">🚩 Flags</span>
                  <span className="text-[7px] text-muted-dark font-mono">{flags.size} active</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALL_FLAGS.map((f) => (
                    <button key={f} onClick={() => toggleFlag(f)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all duration-150 cursor-pointer",
                        flags.has(f)
                          ? "bg-accent/10 text-accent border-accent/30"
                          : "bg-surface-2 text-muted-dark border-border/40 hover:text-foreground hover:border-border-hover"
                      )}>{flags.has(f) ? "✦ " : "○ "}{f}</button>
                  ))}
                </div>
              </div>

              {/* Backend adapter + loading */}
              <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">📦 Backend Adapter</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(Object.keys(PRESETS) as PresetKey[]).map((k) => (
                    <button key={k} onClick={() => setPreset(k)}
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[8px] font-semibold border transition-all duration-150 cursor-pointer",
                        preset === k
                          ? "bg-primary text-white border-transparent"
                          : "bg-surface-2 text-muted border-border hover:text-foreground"
                      )}>{PRESETS[k].name}</button>
                  ))}
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)}
                    className="w-3 h-3 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-[8px] text-muted font-mono">Simulate loading</span>
                </label>
              </div>
            </div>

            {/* ─═ RIGHT: Workspace ═─ */}
            <div className="lg:col-span-8 space-y-3">
              {/* Decision Inspector */}
              <div className="rounded-xl border border-border/50 bg-[#08080a] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-surface-hover/40">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">🔬 Decision Inspector</span>
                  <div className="flex items-center gap-2">
                    <input value={inspectorQuery} onChange={(e) => setInspectorQuery(e.target.value)}
                      className="w-36 h-6 bg-[#060608] border border-border rounded text-[8px] font-mono text-foreground px-2 focus:outline-none focus:border-primary/50"
                      placeholder="query…" />
                    <span className={cn(
                      "text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border",
                      decision.granted ? "text-success bg-success-bg border-success/20" : "text-danger bg-danger-bg border-danger/20"
                    )}>{decision.granted ? "ALLOWED" : "DENIED"}</span>
                  </div>
                </div>
                <div className="p-3">
                  <EngineEvaluation query={inspectorQuery} model={liveModel} />
                </div>
              </div>

              {/* UI Preview + Adapter side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* UI Preview */}
                <div className="rounded-xl border border-border/50 bg-canvas overflow-hidden">
                  <div className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono px-3 py-1.5 border-b border-border/40 bg-surface-hover/40 flex items-center justify-between">
                    <span>🖥️ UI Preview</span>
                    <span className="text-[7px] text-muted-dark font-normal">live · gated</span>
                  </div>
                  {flags.has("features.beta_deployments") && (
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20 py-1.5 px-3 text-[9px] font-bold text-accent flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />🚀 Beta deployments active
                    </div>
                  )}
                  <div className="flex min-h-[180px]">
                    <div className="w-[100px] bg-[#09090c] border-r border-border p-2 flex flex-col gap-1 shrink-0">
                      <span className="text-[6px] font-bold text-muted-dark uppercase tracking-widest mb-1 px-1">Nav</span>
                      <div className="px-2 py-1 rounded text-[8px] font-medium text-foreground bg-surface-hover border border-border-subtle">Dashboard</div>
                      {filteredNav.filter((n) => n.label !== "Dashboard").map((n) => (
                        <div key={n.label} className="px-2 py-1 rounded text-[8px] font-medium text-muted cursor-default flex items-center justify-between">
                          <span>{n.label}</span>
                          {n.permission && <span className="text-[6px] bg-primary/10 text-accent px-1 rounded font-mono">✓</span>}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-border pb-1 mb-1.5">
                          <span className="text-[9px] font-semibold text-foreground">{userName}</span>
                          {flags.has("features.enterprise_sso") && (
                            <span className="text-[6px] text-primary border border-primary/20 bg-primary/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider font-mono">SSO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[7px] text-muted font-mono">Role:</span>
                          <span className="text-[8px] font-semibold text-foreground bg-surface-hover px-1.5 py-0.5 rounded">{role}</span>
                          <span className="text-[7px] text-muted font-mono">· {perms.size} permissions</span>
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-border/30">
                          <span className="text-[8px] text-muted font-mono">Check:</span>
                          <span className="text-[9px] font-mono text-foreground ml-1">{query}</span>
                          {liveModel.permissions?.includes(query) ? (
                            <span className="text-[8px] text-success font-semibold ml-1">✓ ALLOWED</span>
                          ) : (
                            <span className="text-[8px] text-danger font-semibold ml-1">✗ DENIED</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-2 border-t border-border/30 pt-1.5">
                        {perms.has("repositories.write") ? (
                          <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none">+ Create</button>
                        ) : (
                          <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-surface border border-border text-muted-dark cursor-default flex items-center gap-1"><span>🔒</span> Create</button>
                        )}
                        {perms.has("repositories.delete") ? (
                          <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer">Delete</button>
                        ) : (
                          <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-surface border border-border text-muted-dark/40 cursor-not-allowed" disabled>Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adapter live tester */}
                <div className="rounded-xl border border-border/50 bg-[#060608] overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-surface-hover/40">
                    <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono">📥 {PRESETS[preset].name} → AccessModel</span>
                    <span className="text-[7px] text-muted-dark font-mono">
                      {parsedJson ? `${Object.keys(parsedJson).length} keys` : "invalid"}
                    </span>
                  </div>
                  <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)}
                    rows={4} spellCheck={false}
                    className="w-full bg-transparent p-2 text-[8px] font-mono text-foreground/80 focus:outline-none resize-none leading-relaxed" />
                  <div className="border-t border-border/30 px-3 py-1.5 flex items-center gap-2 text-[8px] font-mono flex-wrap">
                    <span className="text-muted-dark">→</span>
                    <span className="text-success">{liveModel.permissions?.length ?? 0} perms</span>
                    <span className="text-accent">{liveModel.user?.roles?.length ?? 0} roles</span>
                    <span className="text-warning">{liveModel.flags?.length ?? 0} flags</span>
                    <span className="text-muted-dark ml-auto">{PRESETS[preset].name} adapter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionProvider>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE CONSOLE — terminal-style log output with optional timing badge
// ════════════════════════════════════════════════════════════════════════════
function StageConsole({
  logs,
  timing,
}: {
  logs?: string[];
  timing?: number;
}) {
  if (!logs || logs.length === 0) return null;
  return (
    <div className="mt-3 border-t border-border/40 pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-1">
          <span className="text-muted-dark">❯</span> Console
        </span>
        {timing !== undefined && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-surface-2 text-muted-dark border border-border/40">
            <span className="w-1 h-1 rounded-full bg-success" />
            {timing}ms
          </span>
        )}
      </div>
      <div className="bg-[#050507] border border-border rounded-lg p-2.5 space-y-0.5 font-mono text-[9px]">
        {logs.map((line, i) => (
          <div key={i} className="flex items-start gap-2 text-muted leading-relaxed">
            <span className="text-muted-dark shrink-0 mt-px">›</span>
            <span>{line}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-muted-dark pt-0.5 border-t border-border/20 mt-1">
          <span className="text-[8px]">exit code 0</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STAGE DETAIL PANEL — wrapper for pipeline stage detail content
// ════════════════════════════════════════════════════════════════════════════
function StageDetailPanel({
  icon,
  title,
  subtitle,
  timing,
  logs,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  timing?: number;
  logs?: string[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/40 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/10 transition-all duration-300 hover:border-border/90">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-surface-hover/50">
        <span className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-[10px] font-bold text-foreground">{title}</span>
        </span>
        <span className="flex items-center gap-2">
          {timing !== undefined && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-surface-2 text-muted-dark border border-border/40">
              <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
              {timing}ms
            </span>
          )}
          <span className="text-[9px] text-muted-dark font-mono">{subtitle}</span>
        </span>
      </div>
      <div className="p-4">
        {children}
        <StageConsole logs={logs} timing={timing} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ENGINE EVALUATION — visual trace of the permission engine logic
// ════════════════════════════════════════════════════════════════════════════
function EngineEvaluation({
  query,
  model,
}: {
  query: string;
  model: AccessModel;
}) {
  const perms = model.permissions ?? [];
  const directMatch = perms.includes(query);
  const wildcardEntries = perms.filter((p) => p.includes("*"));
  const wildcardMatch = wildcardEntries.some((pattern) => {
    if (pattern === "*") return true;
    if (pattern.endsWith(".*")) {
      const prefix = pattern.slice(0, -2);
      return query.startsWith(prefix);
    }
    return false;
  });
  const granted = directMatch || wildcardMatch;

  return (
    <div className="space-y-3">
      {/* Input/Output summary */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-muted">
          Checking <code className="text-foreground font-semibold bg-surface-hover px-1.5 py-0.5 rounded">{query}</code>
        </span>
        <span
          className={cn(
            "font-bold px-2 py-0.5 rounded-full border text-[9px]",
            granted
              ? "text-success bg-success-bg border-success/20"
              : "text-danger bg-danger-bg border-danger/20"
          )}
        >
          {granted ? "GRANTED" : "DENIED"}
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        {/* Step 1: Direct lookup */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span
            className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
              directMatch
                ? "bg-success-bg text-success border border-success/30"
                : "bg-surface-2 text-muted-dark border border-border"
            )}
          >
            {directMatch ? "✓" : "1"}
          </span>
          <span className="text-muted">Direct lookup</span>
          <span className="text-muted-dark ml-auto">
            {directMatch
              ? `"${query}" found in permissions`
              : `"${query}" not in list`}
          </span>
        </div>

        {/* Step 2: Wildcard expansion */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span
            className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
              wildcardMatch
                ? "bg-success-bg text-success border border-success/30"
                : "bg-surface-2 text-muted-dark border border-border"
            )}
          >
            {wildcardMatch ? "✓" : "2"}
          </span>
          <span className="text-muted">Wildcard expansion</span>
          <span className="text-muted-dark ml-auto">
            {wildcardEntries.length > 0
              ? wildcardMatch
                ? `Matched ${wildcardEntries.join(", ")}`
                : `No wildcard match for "${query}"`
              : "No wildcards defined"}
          </span>
        </div>

        {/* Step 3: Role check */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="w-4 h-4 rounded-full bg-surface-2 text-muted-dark border border-border flex items-center justify-center text-[8px] font-bold">
            3
          </span>
          <span className="text-muted">Role-based</span>
          <span className="text-muted-dark ml-auto">
            {model.user?.roles?.length
              ? `Roles: ${model.user.roles.join(", ")}`
              : "No roles assigned"}
          </span>
        </div>
      </div>

      {/* Resolution trace */}
      <div className="pt-2 border-t border-border/40">
        <div className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono mb-1.5 flex items-center justify-between">
          <span>Resolution Trace</span>
          <span className="text-[8px] text-muted-dark font-normal normal-case">
            {perms.length} rules evaluated
          </span>
        </div>
        <div className="bg-[#050507] border border-border rounded-lg p-3 text-[10px] font-mono leading-relaxed">
          <div className="text-muted-dark">
            {`> AccessDecision("${query}")`}
          </div>
          <div className="text-muted pl-4">
            {`├─ permissions: [${perms.join(", ")}]`}
          </div>
          <div className="pl-4">
            {directMatch ? (
              <span className="text-success">├─ ✓ Direct match found</span>
            ) : (
              <span className="text-muted-dark">├─ ✗ No direct match</span>
            )}
          </div>
          <div className="pl-4">
            {wildcardMatch ? (
              <span className="text-success">├─ ✓ Wildcard expanded</span>
            ) : (
              <span className="text-muted-dark">├─ ✗ No wildcard match</span>
            )}
          </div>
          <div className="pl-4 text-accent">
            {`├─ Matched: "${directMatch ? query : wildcardMatch ? wildcardEntries.join(", ") : "—"}"`}
          </div>
          <div className="pl-4 text-muted">
            {`├─ Source: ${directMatch ? "permissions[]" : wildcardMatch ? "wildcard" : "N/A"}`}
          </div>
          <div className={cn("font-bold", granted ? "text-success" : "text-danger")}>
            {`└─ ${granted ? "ALLOWED" : "DENIED"}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  LIVE DECISION — renders permission check result inline
// ════════════════════════════════════════════════════════════════════════════
function LiveDecision({ query }: { query: string }) {
  const decision = useAccessDecision(query);

  const allowed = decision.allowed;
  const permsList = (decision as any).matched || [];

  return (
    <div className="space-y-2">
      {/* verdict badge */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-300",
        allowed
          ? "bg-success-bg text-success border-success/20"
          : "bg-danger-bg text-danger border-danger/20"
      )}>
        <span className={cn(
          "w-2 h-2 rounded-full",
          allowed ? "bg-success animate-pulse" : "bg-danger"
        )} />
        {allowed ? "Access Granted" : "Access Denied"}
      </div>

      {/* details */}
      <div className="space-y-1 text-[10px] font-mono text-muted">
        <div className="flex justify-between">
          <span>Query:</span>
          <span className="text-foreground font-semibold">{query}</span>
        </div>
        <div className="flex justify-between">
          <span>Reason:</span>
          <span className="text-foreground">{decision.reason || "—"}</span>
        </div>
        {permsList.length > 0 && (
          <div className="flex justify-between">
            <span>Matched by:</span>
            <span className="text-accent">{permsList.join(", ")}</span>
          </div>
        )}
      </div>

      {/* wildcard trace */}
      <div className="pt-2 border-t border-border/50">
        <div className="text-[9px] font-bold text-muted uppercase tracking-wider mb-1.5 font-mono">
          Resolution Steps
        </div>
        <DiagnosticSteps query={query} activeModel={decision} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  DIAGNOSTIC STEPS — inline trace
// ════════════════════════════════════════════════════════════════════════════
function DiagnosticSteps({ query, activeModel }: { query: string; activeModel: any }) {
  const permsList: string[] = activeModel?.matched || [];

  const steps = [
    {
      label: "Direct Match",
      ok: permsList.includes(query),
      detail: permsList.includes(query) ? `"${query}" found in permissions` : `"${query}" not in list`,
    },
    {
      label: "Wildcard Expansion",
      ok: permsList.some((p: string) => p.includes("*")),
      detail: permsList.some((p: string) => p.includes("*"))
        ? `Wildcard ${permsList.filter((p: string) => p.includes("*")).join(", ")} matched`
        : "No wildcards matched",
    },
  ];

  return (
    <div className="space-y-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-[10px]">
          <span className={s.ok ? "text-success" : "text-muted-dark"}>
            {s.ok ? "✓" : "○"}
          </span>
          <span className="text-muted">{s.label}</span>
          <span className="text-muted-dark ml-auto font-mono text-[9px] truncate max-w-[140px]">{s.detail}</span>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  SIDEBAR PANEL — live nav pruning
// ════════════════════════════════════════════════════════════════════════════
function SidebarPanel({
  computedModel,
  filteredNav,
}: {
  computedModel: AccessModel;
  filteredNav: NavigationItem[];
}) {
  const perms = computedModel.permissions ?? [];

  const checks = [
    { label: "Dashboard (always visible)",                granted: true },
    { label: "User Management folder",      granted: perms.includes("pages.users") },
    { label: "  List Users",              granted: perms.includes("users.list") },
    { label: "  Create Members",        granted: perms.includes("users.create") },
    { label: "Billing Console",       granted: perms.includes("billing.view") },
    { label: "Security Logs",      granted: perms.includes("settings.manage") },
  ] as const;

  return (
    <div className="rounded-2xl border border-border bg-[#09090c] p-4">
      <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-3 border-b border-border pb-2 flex items-center justify-between">
        <span>🌳 Sidebar Pruner</span>
        <span className="text-[9px] font-mono text-muted-dark font-normal normal-case">{filteredNav.length} items visible</span>
      </span>

      <div className="grid grid-cols-2 gap-4">
        {/* Permission checklist */}
        <div>
          <span className="text-[9px] text-muted-dark font-mono block mb-2">Permission Check</span>
          <div className="space-y-1 text-[10px] text-muted font-mono">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className={c.granted ? "text-success" : "text-danger"}>
                  {c.granted ? "✓" : "✗"}
                </span>
                <span className="truncate">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pruned output */}
        <div>
          <span className="text-[9px] text-muted-dark font-mono block mb-2">Pruned Nav</span>
          {filteredNav.length === 0 ? (
            <div className="text-[10px] text-muted-dark italic flex items-center justify-center h-full">
              All items hidden
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNav.map((item) => (
                <div key={item.label}>
                  <div className="px-2 py-1 bg-surface border border-border-subtle rounded-lg text-[10px] text-foreground font-medium flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.permission && (
                      <span className="text-[7px] font-mono text-muted-dark bg-surface-2 px-1 rounded">{item.permission}</span>
                    )}
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="pl-3 mt-0.5 space-y-0.5 border-l-2 border-primary/20 ml-2">
                      {item.children.map((child) => (
                        <div key={child.label} className="px-2 py-0.5 bg-surface/40 border border-border-subtle rounded text-[9px] text-muted font-mono flex items-center justify-between">
                          <span>{child.label}</span>
                          <span className="text-[7px] text-muted-dark">{child.permission}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  DATATABLE PANEL — live row filtering
// ════════════════════════════════════════════════════════════════════════════
function DatatablePanel({
  computedModel,
}: {
  computedModel: AccessModel;
}) {
  const currentUserId = computedModel.user?.id ?? "";
  const permissions = computedModel.permissions ?? [];

  return (
    <div className="rounded-2xl border border-border bg-[#09090c] p-4">
      <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-3 border-b border-border pb-2 flex items-center justify-between">
        <span>📊 Data Table Row Filter</span>
        <span className="text-[9px] font-mono text-muted-dark font-normal normal-case">
          {MOCK_DOCUMENTS.filter(d => {
            const isOwner = d.ownerId === currentUserId;
            const hasScope = permissions.some(
              p => p === `docs.view.${d.classification}` || p === "docs.view.*" || p === "docs.*" || p === "*"
            );
            return d.classification === "public" || isOwner || hasScope;
          }).length} visible
        </span>
      </span>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono border-b border-border">
              <th className="pb-2 pr-2">Document</th>
              <th className="pb-2 pr-2">Class</th>
              <th className="pb-2 pr-2">Owner</th>
              <th className="pb-2 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="text-[10px] divide-y divide-border/40">
            {MOCK_DOCUMENTS.map((doc) => {
              const isOwner = doc.ownerId === currentUserId;
              const hasScope = permissions.some(
                p => p === `docs.view.${doc.classification}` || p === "docs.view.*" || p === "docs.*" || p === "*"
              );
              const allowed = doc.classification === "public" || isOwner || hasScope;

              return (
                <tr key={doc.id} className={cn(allowed ? "hover:bg-surface/20" : "opacity-40 hover:opacity-60", "transition-all duration-200")}>
                  <td className="py-1.5 pr-2 font-medium max-w-[120px] truncate">
                    {allowed ? doc.title : "🔒 [Redacted]"}
                  </td>
                  <td className="py-1.5 pr-2">
                    <span className={cn(
                      "inline-flex px-1.5 py-0.5 rounded text-[8px] font-mono border",
                      doc.classification === "public" ? "bg-success-bg text-success border-success/15"
                        : doc.classification === "confidential" ? "bg-warning-bg text-warning border-warning/15"
                          : "bg-danger-bg text-danger border-danger/15"
                    )}>
                      {doc.classification}
                    </span>
                  </td>
                  <td className="py-1.5 pr-2 font-mono text-muted-dark text-[9px]">
                    {doc.ownerId}
                    {isOwner && <span className="text-[8px] text-accent bg-primary/10 ml-1 px-1 rounded">you</span>}
                  </td>
                  <td className="py-1.5 text-right">
                    {allowed ? (
                      <span className="text-success font-bold text-[9px]">Allowed</span>
                    ) : (
                      <span className="text-danger font-bold text-[9px]">Denied</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  COMPARISON SECTION — Without Accessly vs With Accessly
//  Visually sells the library with side-by-side code examples
// ════════════════════════════════════════════════════════════════════════════

type ComparisonExample = {
  id: string;
  icon: string;
  title: string;
  withoutLabel: string;
  withLabel: string;
  without: { code: string; lines: number; complexity: string };
  with: { code: string; lines: number; complexity: string };
};

const COMPARISONS: ComparisonExample[] = [
  {
    id: "gating",
    icon: "🚪",
    title: "Component Gating",
    withoutLabel: "Nested conditionals",
    withLabel: "Declarative <Can>",
    without: {
      code: `// Without Accessly: manual checks everywhere
function RepoButton({ user, permissions, flags }) {
  const canWrite =
    permissions.includes("repositories.write") &&
    user.roles.includes("editor") &&
    flags?.beta_deployments !== false;

  if (!canWrite) {
    return (
      <Tooltip text="You need repositories.write">
        <button disabled className="btn-muted">
          🔒 Create Repository
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={handleCreate}
      className="btn-primary"
    >
      + Create Repository
    </button>
  );
}`,
      lines: 24,
      complexity: "4 checks · 1 nested if · manual disabled state",
    },
    with: {
      code: `// With Accessly: one declarative wrapper
import { Can } from "accessly";

function RepoButton() {
  return (
    <Can
      permission="repositories.write"
      fallback={
        <button disabled className="btn-muted">
          🔒 Create Repository
        </button>
      }
    >
      <button onClick={handleCreate} className="btn-primary">
        + Create Repository
      </button>
    </Can>
  );
}`,
      lines: 18,
      complexity: "1 component · 0 conditionals · auto-gated",
    },
  },
  {
    id: "nav",
    icon: "🧭",
    title: "Navigation Filtering",
    withoutLabel: "Manual role/perm checking",
    withLabel: "filterNavigation()",
    without: {
      code: `// Without Accessly: filter everywhere
function Sidebar({ user, permissions, flags }) {
  const items = [];

  // Dashboard — always visible
  items.push({ label: "Dashboard", href: "/" });

  // User management — check role + permission
  if (
    user.roles.includes("admin") &&
    permissions.includes("pages.users")
  ) {
    items.push({
      label: "Users",
      children: [
        permissions.includes("users.list") &&
          { label: "List", href: "/users" },
        permissions.includes("users.create") &&
          { label: "Create", href: "/users/new" },
      ].filter(Boolean),
    });
  }

  // Billing — check permission + feature flag
  if (
    permissions.includes("billing.view") &&
    flags?.enterprise_sso
  ) {
    items.push({ label: "Billing", href: "/billing" });
  }

  // Settings
  if (permissions.includes("settings.manage")) {
    items.push({ label: "Settings", href: "/settings" });
  }

  return renderNav(items);
}`,
      lines: 44,
      complexity: "6 manual checks · 3 nested ifs · mixed role + perm logic",
    },
    with: {
      code: `// With Accessly: one function call
import { filterNavigation } from "accessly";

const NAV = [
  { label: "Dashboard", href: "/" },
  {
    label: "Users", permission: "pages.users",
    children: [
      { label: "List", href: "/users", permission: "users.list" },
      { label: "Create", href: "/users/new", permission: "users.create" },
    ],
  },
  { label: "Billing", href: "/billing", permission: "billing.view" },
  { label: "Settings", href: "/settings", permission: "settings.manage" },
];

function Sidebar({ accessModel }) {
  const visible = filterNavigation(NAV, accessModel);
  return renderNav(visible);
}`,
      lines: 22,
      complexity: "1 function · 0 conditionals · declarative config",
    },
  },
  {
    id: "permission-check",
    icon: "🔍",
    title: "Inline Permission Check",
    withoutLabel: "Manual array.includes()",
    withLabel: "useAccessDecision()",
    without: {
      code: `// Without Accessly: scattered logic
function handleDelete(document) {
  // Check permission
  if (!permissions.includes("repositories.delete")) {
    toast.error("Access denied");
    return;
  }

  // Check ownership
  if (document.ownerId !== user.id) {
    toast.error("You don't own this");
    return;
  }

  // Check classification
  if (
    document.classification === "secret" &&
    !permissions.includes("docs.view.secret")
  ) {
    toast.error("Classified document");
    return;
  }

  // Check feature flag
  if (!flags?.audit_logs) {
    toast.warn("Audit logging disabled");
  }

  executeDelete(document);
}`,
      lines: 29,
      complexity: "4 separate checks · 3 early returns · mixed logic",
    },
    with: {
      code: `// With Accessly: one declarative hook
import { useAccessDecision } from "accessly";

function DeleteButton({ document }) {
  const { allowed, reason } = useAccessDecision(
    "repositories.delete",
    {
      owner: document.ownerId,
      classification: \`docs.view.\${document.classification}\`,
    }
  );

  if (!allowed) {
    return <Tooltip text={reason}><button disabled /></Tooltip>;
  }

  return <button onClick={executeDelete}>Delete</button>;
}`,
      lines: 18,
      complexity: "1 hook · automatic wildcard + role checks · context-aware",
    },
  },
  {
    id: "provider",
    icon: "📦",
    title: "Global Setup",
    withoutLabel: "Props drilling everywhere",
    withLabel: "<PermissionProvider>",
    without: {
      code: `// Without Accessly: props drilling
// Every component needs permissions passed down
<App>
  <Sidebar user={user} perms={perms} flags={flags} />
  <Dashboard user={user} perms={perms} flags={flags} />
  <BillingPage
    user={user}
    perms={perms}
    flags={flags}
    roles={roles}
  />
  <SettingsPage
    user={user}
    perms={perms}
    flags={flags}
    onToggle={handleToggle}
  />
</App>

// Components grow larger with every new check
function BillingPage({ user, perms, flags, roles }) {
  const canView = perms.includes("billing.view");
  // … 20 more lines of permission logic
}`,
      lines: 22,
      complexity: "Props drilling · no central authority · manual propagation",
    },
    with: {
      code: `// With Accessly: one provider at the root
import { PermissionProvider } from "accessly";

<PermissionProvider access={accessModel}>
  <App>
    <Sidebar />
    <Dashboard />
    <BillingPage />
    <SettingsPage />
  </App>
</PermissionProvider>

// Any child can use <Can>, useAccessDecision(), etc.
// without any props or drilling.
function BillingPage() {
  if (!can("billing.view")) return <Redirect to="/" />;
  return <BillingDashboard />;
}`,
      lines: 18,
      complexity: "Central provider · zero props passed · auto-available everywhere",
    },
  },
];

function ComparisonSection() {
  const [activeExample, setActiveExample] = useState<string>(COMPARISONS[0].id);
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  const current = COMPARISONS.find((c) => c.id === activeExample) ?? COMPARISONS[0];

  const withoutClean = current.without.code
    .replace(/\/\/.*$/gm, (m) => `\x1b[90m${m}\x1b[0m`);

  return (
    <div>
      {/* Example picker tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        {COMPARISONS.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setActiveExample(ex.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold whitespace-nowrap border transition-all duration-200 cursor-pointer",
              activeExample === ex.id
                ? "bg-surface-hover border-primary/30 text-foreground shadow-sm"
                : "bg-transparent border-border/50 text-muted hover:text-foreground hover:border-border"
            )}
          >
            <span>{ex.icon}</span>
            <span>{ex.title}</span>
          </button>
        ))}
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* WITHOUT ACCESSLY */}
        <div className="rounded-xl border border-danger/20 overflow-hidden bg-[#0a0606] shadow-lg shadow-black/15">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-danger/15 bg-danger/5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-danger/15 flex items-center justify-center text-[10px]">✗</span>
              <span className="text-[10px] font-bold text-danger tracking-tight">Without Accessly</span>
            </div>
            <span className="text-[7px] font-mono text-muted-dark bg-danger/5 px-1.5 py-0.5 rounded border border-danger/10">
              {current.without.complexity}
            </span>
          </div>

          {/* Code */}
          <div className="relative">
            <pre className="p-3 text-[9.5px] font-mono leading-relaxed overflow-x-auto max-h-[320px] overflow-y-auto text-rose-200/70">
              {current.without.code.split("\n").map((line, i) => {
                // Highlight dangerous patterns
                const isConditional = /^\s*(if|else if|&&|\|\|)/.test(line);
                const isReturn = /^\s*return/.test(line);
                return (
                  <div key={i} className={cn(
                    "whitespace-pre-wrap",
                    isConditional && "text-rose-300 font-semibold",
                    isReturn && "text-rose-400",
                    !isConditional && !isReturn && "text-rose-200/60"
                  )}>
                    {line || " "}
                  </div>
                );
              })}
            </pre>
            {/* Complexity heat badge overlay */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[6px] font-mono bg-danger/20 text-danger border border-danger/20">
              {current.without.lines} lines · high complexity
            </div>
          </div>
        </div>

        {/* WITH ACCESSLY */}
        <div className="rounded-xl border border-success/20 overflow-hidden bg-[#060a08] shadow-lg shadow-black/15">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-success/15 bg-success/5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center text-[10px]">✓</span>
              <span className="text-[10px] font-bold text-success tracking-tight">With Accessly</span>
            </div>
            <span className="text-[7px] font-mono text-muted-dark bg-success/5 px-1.5 py-0.5 rounded border border-success/10">
              {current.with.complexity}
            </span>
          </div>

          {/* Code */}
          <div className="relative">
            <pre className="p-3 text-[9.5px] font-mono leading-relaxed overflow-x-auto max-h-[320px] overflow-y-auto text-emerald-200/80">
              {current.with.code.split("\n").map((line, i) => {
                // Highlight Accessly imports and components
                const isImport = /^\s*import.*accessly/.test(line);
                const isComponent = /<Can|PermissionProvider|ProtectedRoute/.test(line);
                const isHook = /useAccessDecision|filterNavigation|\.allowed/.test(line);
                return (
                  <div key={i} className={cn(
                    "whitespace-pre-wrap",
                    isImport && "text-accent font-semibold",
                    isComponent && "text-emerald-300 font-semibold",
                    isHook && "text-emerald-300",
                    !isImport && !isComponent && !isHook && "text-emerald-200/70"
                  )}>
                    {line || " "}
                  </div>
                );
              })}
            </pre>
            {/* Simplicity badge */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[6px] font-mono bg-success/20 text-success border border-success/20">
              {current.with.lines} lines · clean
            </div>
          </div>
        </div>
      </div>

      {/* Benefit callout row */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="rounded-lg border border-border/40 bg-surface/20 p-2.5 text-center">
          <span className="text-[16px] block mb-0.5">📉</span>
          <span className="text-[8px] font-bold text-foreground block">Less Code</span>
          <span className="text-[7px] text-muted font-mono">
            {Math.round((1 - current.with.lines / current.without.lines) * 100)}% fewer lines
          </span>
        </div>
        <div className="rounded-lg border border-border/40 bg-surface/20 p-2.5 text-center">
          <span className="text-[16px] block mb-0.5">🧹</span>
          <span className="text-[8px] font-bold text-foreground block">Zero Conditionals</span>
          <span className="text-[7px] text-muted font-mono">No if/else in components</span>
        </div>
        <div className="rounded-lg border border-border/40 bg-surface/20 p-2.5 text-center">
          <span className="text-[16px] block mb-0.5">🛡️</span>
          <span className="text-[8px] font-bold text-foreground block">Type Safe</span>
          <span className="text-[7px] text-muted font-mono">Full TypeScript inference</span>
        </div>
        <div className="rounded-lg border border-border/40 bg-surface/20 p-2.5 text-center">
          <span className="text-[16px] block mb-0.5">⚡</span>
          <span className="text-[8px] font-bold text-foreground block">Reactive</span>
          <span className="text-[7px] text-muted font-mono">Auto re-renders on change</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 text-center">
        <a
          href="/docs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-primary to-violet shadow-lg shadow-primary/25 no-underline transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          <span>📖</span>
          Read the docs
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ADAPTER BUILDER — three‑column visual mapper: Source JSON → Rules → Output
// ════════════════════════════════════════════════════════════════════════════
type MappingRule = {
  id: string;
  source: string;
  transform: "direct" | "filter" | "map" | "concat" | "keys";
  transformDetail: string;
  target: string;
};

const PRESET_MAPPINGS: Record<PresetKey, MappingRule[]> = {
  laravel: [
    { id: "m1", source: "all_permissions", transform: "direct", transformDetail: "", target: "permissions[]" },
    { id: "m2", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m3", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
    { id: "m4", source: "user.roles", transform: "direct", transformDetail: "", target: "roles[]" },
  ],
  nestjs: [
    { id: "m1", source: "abilities", transform: "direct", transformDetail: "", target: "permissions[]" },
    { id: "m2", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m3", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
    { id: "m4", source: "user.roles", transform: "direct", transformDetail: "", target: "roles[]" },
  ],
  aspnet: [
    { id: "m1", source: "claims[].value", transform: "filter", transformDetail: "type == 'permission'", target: "permissions[]" },
    { id: "m2", source: "role", transform: "direct", transformDetail: "", target: "roles[]" },
    { id: "m3", source: "nameid", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m4", source: "name", transform: "direct", transformDetail: "", target: "user.name" },
  ],
  springboot: [
    { id: "m1", source: "authorities[].authority", transform: "map", transformDetail: ".authority", target: "permissions[]" },
    { id: "m2", source: "user.roles", transform: "direct", transformDetail: "", target: "roles[]" },
    { id: "m3", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m4", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
  ],
  supabase: [
    { id: "m1", source: "permissions", transform: "direct", transformDetail: "", target: "permissions[]" },
    { id: "m2", source: "features{}", transform: "keys", transformDetail: "value == true", target: "flags[]" },
    { id: "m3", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m4", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
    { id: "m5", source: "user.roles", transform: "direct", transformDetail: "", target: "roles[]" },
  ],
  express: [
    { id: "m1", source: "scope + permissions", transform: "concat", transformDetail: "", target: "permissions[]" },
    { id: "m2", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m3", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
    { id: "m4", source: "user.roles", transform: "direct", transformDetail: "", target: "roles[]" },
  ],
  custom: [
    { id: "m1", source: "permissions", transform: "direct", transformDetail: "", target: "permissions[]" },
    { id: "m2", source: "user.id", transform: "direct", transformDetail: "", target: "user.id" },
    { id: "m3", source: "user.name", transform: "direct", transformDetail: "", target: "user.name" },
  ],
};

const TRANSFORM_COLORS: Record<string, string> = {
  direct: "bg-primary/10 text-accent border-primary/20",
  filter: "bg-warning-bg text-warning border-warning/20",
  map: "bg-accent/10 text-accent border-accent/20",
  concat: "bg-info/10 text-info border-info/20",
  keys: "bg-success-bg text-success border-success/20",
};

function AdapterBuilder({
  presetKey,
  sourceJson,
  onJsonChange,
}: {
  presetKey: PresetKey;
  sourceJson: string;
  onJsonChange: (v: string) => void;
}) {
  const [mappings, setMappings] = useState<MappingRule[]>(PRESET_MAPPINGS[presetKey]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"adapter" | "model">("model");

  useEffect(() => {
    setMappings(PRESET_MAPPINGS[presetKey]);
  }, [presetKey]);

  const parsed = useMemo(() => {
    try { return JSON.parse(sourceJson); } catch { return null; }
  }, [sourceJson]);

  const previewModel = useMemo(() => {
    const p = parsed;
    if (!p) return null;
    const result: Record<string, any> = {};
    for (const rule of mappings) {
      if (rule.target === "permissions[]") {
        const val = extractSource(p, rule);
        result.permissions = Array.isArray(val) ? val : [];
      } else if (rule.target === "roles[]") {
        const val = extractSource(p, rule);
        result.roles = Array.isArray(val) ? val : [];
      } else if (rule.target === "flags[]") {
        const val = extractSource(p, rule);
        result.flags = Array.isArray(val) ? val : [];
      } else if (rule.target === "user.id") {
        const val = extractSource(p, rule);
        result.userId = String(val ?? "");
      } else if (rule.target === "user.name") {
        const val = extractSource(p, rule);
        result.userName = String(val ?? "");
      }
    }
    return result;
  }, [parsed, mappings]);

  function extractSource(obj: any, rule: MappingRule): any {
    if (!obj) return null;
    switch (rule.transform) {
      case "direct":
        return resolvePath(obj, rule.source);
      case "filter": {
        if (rule.transformDetail.includes("value == true")) {
          return Object.entries(obj.features ?? {})
            .filter(([_, v]) => v === true)
            .map(([k]) => `features.${k}`);
        }
        const parts = rule.transformDetail.split(" == ").map(s => s.replace(/'/g, "").trim());
        if (parts.length < 2) return [];
        const [field, expected] = parts;
        const arr = resolvePath(obj, rule.source.replace(/\[\].*$/, ""));
        if (!Array.isArray(arr)) return [];
        return arr.filter((item: any) => item[field] === expected).map((item: any) => item.value ?? item);
      }
      case "map": {
        const base = rule.source.replace(/\[\].*$/, "");
        const arr = resolvePath(obj, base);
        if (!Array.isArray(arr)) return [];
        const field = rule.transformDetail.replace(".", "").trim();
        return arr.map((item: any) => item[field] ?? item);
      }
      case "concat": {
        const parts = rule.source.split(/\s*\+\s*/);
        const results: any[] = [];
        for (const part of parts) {
          const val = resolvePath(obj, part.trim());
          if (Array.isArray(val)) results.push(...val);
        }
        return results;
      }
      case "keys": {
        const base = rule.source.replace(/\{\}$/, "");
        const objVal = resolvePath(obj, base);
        if (!objVal || typeof objVal !== "object") return [];
        if (rule.transformDetail.includes("value == true")) {
          return Object.entries(objVal)
            .filter(([_, v]) => v === true)
            .map(([k]) => `features.${k}`);
        }
        return Object.keys(objVal).map(k => `features.${k}`);
      }
      default:
        return null;
    }
  }

  function resolvePath(obj: any, path: string): any {
    const clean = path.replace(/\[\]$/, "").replace(/\{\}$/, "");
    const parts = clean.split(".");
    let current = obj;
    for (const part of parts) {
      if (current == null) return null;
      current = current[part];
    }
    return current;
  }

  function handleCopy() {
    const text = JSON.stringify({
      permissions: previewModel?.permissions ?? [],
      roles: previewModel?.roles ?? [],
      flags: previewModel?.flags ?? [],
      user: { id: previewModel?.userId ?? "", name: previewModel?.userName ?? "" },
    }, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleReset() {
    setMappings(PRESET_MAPPINGS[presetKey]);
    onJsonChange(JSON.stringify(PRESETS[presetKey].payload, null, 2));
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-muted uppercase tracking-wider font-mono">
            {PRESETS[presetKey].name} adapter
          </span>
          <span className="text-[8px] text-muted-dark font-mono">
            {mappings.length} mapping rules
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleReset}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium text-muted hover:text-foreground border border-border hover:border-border-hover transition-all duration-150 cursor-pointer bg-transparent">
            <span>↺</span> Reset
          </button>
          <button onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium border transition-all duration-150 cursor-pointer bg-transparent",
              copied ? "border-success/30 text-success" : "border-border text-muted hover:text-foreground hover:border-border-hover"
            )}>
            {copied ? "✓ Copied" : "📋 Copy Output"}
          </button>
        </div>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* LEFT: Source JSON */}
        <div className="md:col-span-4 bg-[#060608] border border-border rounded-xl overflow-hidden">
          <div className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono px-3 py-1.5 border-b border-border/40 bg-surface-hover/40 flex items-center justify-between">
            <span>📥 Source JSON</span>
            <span className="text-[7px] text-muted-dark normal-case">{parsed ? `${Object.keys(parsed).length} keys` : "invalid"}</span>
          </div>
          <textarea value={sourceJson} onChange={(e) => onJsonChange(e.target.value)}
            rows={8} spellCheck={false}
            className="w-full bg-transparent p-3 text-[10px] font-mono text-foreground/80 focus:outline-none resize-y leading-relaxed placeholder:text-muted-dark/40" />
        </div>

        {/* CENTER: Mapping Rules */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-2">
            <span>↔️ Mapping Rules</span>
          </div>
          {mappings.map((rule, i) => (
            <div key={rule.id} className="group relative">
              {i > 0 && <div className="h-1 w-px bg-border mx-auto" />}
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 transition-all duration-200 hover:border-border hover:bg-surface/60">
                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                  <span className="text-foreground font-semibold bg-surface-hover px-1.5 py-0.5 rounded shrink-0 max-w-[100px] truncate" title={rule.source}>
                    {rule.source}
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider border shrink-0",
                    TRANSFORM_COLORS[rule.transform] || "text-muted border-border"
                  )}>
                    {rule.transform}
                    {rule.transformDetail && (
                      <span className="ml-0.5 font-mono normal-case font-normal">({rule.transformDetail})</span>
                    )}
                  </span>
                  <span className="text-muted-dark shrink-0">→</span>
                  <span className="text-accent font-semibold bg-accent/5 px-1.5 py-0.5 rounded shrink-0">
                    {rule.target}
                  </span>
                </div>
                {/* Data preview */}
                <div className="mt-1 text-[7px] text-muted-dark font-mono truncate">
                  {parsed && previewModel ? (
                    <span><span className="text-muted">ex:</span> {JSON.stringify(extractSource(parsed, rule)).slice(0, 60)}</span>
                  ) : (
                    <span className="italic">no data</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Generated AccessModel */}
        <div className="md:col-span-4 bg-[#060608] border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-surface-hover/40">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>📋</span> Generated AccessModel
            </span>
            <button onClick={() => setActiveTab(activeTab === "model" ? "adapter" : "model")}
              className="text-[7px] text-muted-dark hover:text-foreground font-mono underline underline-offset-2 cursor-pointer bg-transparent border-none">
              {activeTab === "model" ? "show adapter code" : "show model"}
            </button>
          </div>

          {activeTab === "model" ? (
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-mono bg-success-bg text-success border border-success/20">
                  <span className="w-1 h-1 rounded-full bg-success" />{previewModel?.permissions?.length ?? 0} permissions</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-mono bg-accent/10 text-accent border border-accent/20">
                  <span className="w-1 h-1 rounded-full bg-accent" />{previewModel?.roles?.length ?? 0} roles</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-mono bg-warning-bg text-warning border border-warning/20">
                  <span className="w-1 h-1 rounded-full bg-warning" />{previewModel?.flags?.length ?? 0} flags</span>
              </div>
              <pre className="text-[10px] font-mono text-foreground/80 leading-relaxed overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify({
                  permissions: previewModel?.permissions ?? [],
                  roles: previewModel?.roles ?? [],
                  flags: previewModel?.flags ?? [],
                  user: { id: previewModel?.userId ?? "", name: previewModel?.userName ?? "" },
                }, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-3">
              <pre className="text-[10px] font-mono text-success leading-relaxed overflow-x-auto">
                {PRESETS[presetKey].adapterCode}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  PERMISSION PLAYGROUND — toggle roles, permissions, flags, nav; see instant
//  decisions + React UI preview
// ════════════════════════════════════════════════════════════════════════════
const PG_ROLES = ["admin", "editor", "developer", "manager", "viewer", "service"];
const PG_PERMS = [
  "repositories.read", "repositories.write", "repositories.delete",
  "billing.view", "billing.edit", "settings.manage", "users.list", "users.create",
];
const PG_FLAGS_LIST = ["features.beta_deployments", "features.enterprise_sso", "features.audit_logs"];

const PG_NAV: { label: string; permission?: string; children?: { label: string; permission: string }[] }[] = [
  { label: "Dashboard" },
  { label: "User Management", permission: "pages.users", children: [
    { label: "List Users", permission: "users.list" },
    { label: "Create Members", permission: "users.create" },
  ]},
  { label: "Billing Console", permission: "billing.view" },
  { label: "Security Logs", permission: "settings.manage" },
];

function PermissionPlayground({ baseModel }: { baseModel: AccessModel }) {
  const [selRole, setSelRole] = useState(baseModel.user?.roles?.[0] || "developer");
  const [togPerms, setTogPerms] = useState<Set<string>>(new Set(baseModel.permissions ?? []));
  const [togFlags, setTogFlags] = useState<Set<string>>(new Set(baseModel.flags ?? []));
  const [uName, setUName] = useState((baseModel.user as { name?: string })?.name || "Alex Dev");
  const [uId, setUId] = useState(baseModel.user?.id || "usr_playground");
  const [qPerm, setQPerm] = useState("repositories.write");
  const [navEn, setNavEn] = useState<Set<string>>(new Set(PG_NAV.map(n => n.label)));

  const liveModel = useMemo<AccessModel>(() => ({
    user: { id: uId, name: uName, roles: [selRole] },
    permissions: Array.from(togPerms),
    flags: Array.from(togFlags),
    isLoading: false,
  }), [selRole, togPerms, togFlags, uName, uId]);

  const togglePerm = (p: string) => {
    setTogPerms((prev) => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  };
  const toggleFlag = (f: string) => {
    setTogFlags((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  };
  const toggleNav = (l: string) => {
    setNavEn((prev) => { const n = new Set(prev); n.has(l) ? n.delete(l) : n.add(l); return n; });
  };

  const filteredNav = useMemo(() => {
    return PG_NAV.filter((item) => {
      if (!navEn.has(item.label)) return false;
      if (item.permission && !togPerms.has(item.permission)) return false;
      if (item.children) item.children = item.children.filter((c) => togPerms.has(c.permission));
      return true;
    });
  }, [navEn, togPerms]);

  return (
    <PermissionProvider access={liveModel}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Controls */}
        <div className="lg:col-span-7 space-y-3">
          {/* Role */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>🎭 Role</span>
              <span className="text-[7px] text-muted-dark normal-case font-normal">select a role</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PG_ROLES.map((role) => (
                <button key={role} onClick={() => setSelRole(role)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer",
                    selRole === role
                      ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                      : "bg-surface-2 text-muted border-border hover:text-foreground hover:border-border-hover"
                  )}>{role}</button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>🔑 Permissions</span>
              <span className="text-[7px] text-muted-dark normal-case font-normal">{togPerms.size} active</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PG_PERMS.map((perm) => {
                const on = togPerms.has(perm);
                return (
                  <button key={perm} onClick={() => togglePerm(perm)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[9px] font-mono border transition-all duration-150 cursor-pointer",
                      on ? "bg-success-bg text-success border-success/30 shadow-sm"
                         : "bg-surface-2 text-muted-dark border-border hover:text-foreground hover:border-border-hover"
                    )}>{on ? "✓ " : ""}{perm}</button>
                );
              })}
            </div>
          </div>

          {/* Flags */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>🚩 Feature Flags</span>
              <span className="text-[7px] text-muted-dark normal-case font-normal">{togFlags.size} active</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PG_FLAGS_LIST.map((flag) => {
                const on = togFlags.has(flag);
                return (
                  <button key={flag} onClick={() => toggleFlag(flag)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[9px] font-mono border transition-all duration-150 cursor-pointer",
                      on ? "bg-accent/10 text-accent border-accent/30 shadow-sm"
                         : "bg-surface-2 text-muted-dark border-border hover:text-foreground hover:border-border-hover"
                    )}>{on ? "✦ " : ""}{flag}</button>
                );
              })}
            </div>
          </div>

          {/* User / Auth */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>🆔 User / Auth</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-muted font-mono">ID:</span>
                <input type="text" value={uId} onChange={(e) => setUId(e.target.value)}
                  className="w-28 h-6 bg-[#060608] border border-border rounded text-[9px] font-mono text-foreground px-2 focus:outline-none focus:border-primary/50" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-muted font-mono">Name:</span>
                <input type="text" value={uName} onChange={(e) => setUName(e.target.value)}
                  className="w-28 h-6 bg-[#060608] border border-border rounded text-[9px] font-mono text-foreground px-2 focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>🧭 Navigation</span>
              <span className="text-[7px] text-muted-dark normal-case font-normal">{filteredNav.length} items visible</span>
            </span>
            <div className="space-y-1">
              {PG_NAV.map((item) => {
                const on = navEn.has(item.label);
                return (
                  <div key={item.label}>
                    <label className="flex items-center gap-2 cursor-pointer py-0.5">
                      <input type="checkbox" checked={on} onChange={() => toggleNav(item.label)}
                        className="w-3 h-3 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                      <span className="text-[10px] font-mono text-foreground">{item.label}</span>
                      {item.permission && (
                        <span className={cn("text-[7px] font-mono px-1 py-0.5 rounded border",
                          togPerms.has(item.permission) ? "text-success border-success/20 bg-success-bg"
                            : "text-muted-dark border-border/40")}>{item.permission}</span>
                      )}
                    </label>
                    {item.children && (
                      <div className="ml-5 space-y-0.5 mt-0.5 border-l border-border/30 pl-2">
                        {item.children.map((child) => {
                          const childOn = togPerms.has(child.permission);
                          return (
                            <div key={child.label} className="flex items-center gap-2 py-0.5">
                              <span className={cn("w-1.5 h-1.5 rounded-full", childOn ? "bg-success" : "bg-muted-dark")} />
                              <span className={cn("text-[9px] font-mono", childOn ? "text-foreground" : "text-muted-dark")}>{child.label}</span>
                              <span className="text-[7px] text-muted-dark font-mono">{child.permission}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Decision + UI Preview */}
        <div className="lg:col-span-5 space-y-3">
          {/* Live Decision */}
          <div className="rounded-xl border border-border/50 bg-surface/30 p-3">
            <span className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span>⚡ Live Decision</span>
            </span>
            <div className="relative mb-2">
              <input type="text" value={qPerm} onChange={(e) => setQPerm(e.target.value)}
                className="w-full h-8 pl-3 pr-8 bg-[#060608] border border-border rounded-lg text-[10px] font-mono text-foreground focus:outline-none focus:border-primary/50"
                placeholder="e.g. repositories.write" />
              {qPerm && (
                <button onClick={() => setQPerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-dark hover:text-foreground text-xs leading-none cursor-pointer">✕</button>
              )}
            </div>
            {qPerm ? <LiveDecision query={qPerm} /> : (
              <div className="flex items-center justify-center h-10 text-[9px] text-muted italic">Enter a permission</div>
            )}
          </div>

          {/* Mini React UI Preview */}
          <div className="rounded-xl border border-border/50 bg-canvas overflow-hidden">
            <div className="text-[8px] font-bold text-muted uppercase tracking-wider font-mono px-3 py-1.5 border-b border-border/40 bg-surface-hover/40 flex items-center justify-between">
              <span>🖥️ React UI Preview</span>
              <span className="text-[7px] text-muted-dark font-normal normal-case">live · gated</span>
            </div>

            {togFlags.has("features.beta_deployments") && (
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20 py-1.5 px-3 text-[9px] font-bold text-accent flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />🚀 Beta deployments active</div>
            )}

            <div className="flex min-h-[180px]">
              <div className="w-[120px] bg-[#09090c] border-r border-border p-2 flex flex-col gap-1 shrink-0">
                <span className="text-[6px] font-bold text-muted-dark uppercase tracking-widest mb-1 px-1">Nav</span>
                <div className="px-2 py-1 rounded text-[9px] font-medium text-foreground bg-surface-hover border border-border-subtle cursor-default">Dashboard</div>
                {filteredNav.map((item) => (
                  <div key={item.label} className="px-2 py-1 rounded text-[9px] font-medium text-muted cursor-default flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.permission && <span className="text-[6px] bg-primary/10 text-accent px-1 rounded font-mono">✓</span>}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-1 mb-1.5">
                    <div>
                      <span className="text-[10px] font-semibold text-foreground">{uName}</span>
                      <span className="text-[7px] text-muted font-mono ml-1">({uId})</span>
                    </div>
                    {togFlags.has("features.enterprise_sso") && (
                      <span className="text-[6px] text-primary border border-primary/20 bg-primary/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider font-mono">SSO</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[7px] text-muted font-mono">Role:</span>
                    <span className="text-[8px] font-semibold text-foreground bg-surface-hover px-1.5 py-0.5 rounded">{selRole}</span>
                    <span className="text-[7px] text-muted font-mono">· {togPerms.size} permissions</span>
                  </div>

                  {qPerm && (
                    <div className="mt-1.5 pt-1.5 border-t border-border/30">
                      <span className="text-[8px] text-muted font-mono">Check:</span>
                      <span className="text-[9px] font-mono text-foreground ml-1">{qPerm}</span>
                      {(liveModel.permissions ?? []).includes(qPerm) ? (
                        <span className="text-[8px] text-success font-semibold ml-1">✓ ALLOWED</span>
                      ) : (
                        <span className="text-[8px] text-danger font-semibold ml-1">✗ DENIED</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 mt-2 border-t border-border/30 pt-1.5">
                  {togPerms.has("repositories.write") ? (
                    <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none">+ Create</button>
                  ) : (
                    <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-surface border border-border text-muted-dark cursor-default flex items-center gap-1"><span>🔒</span> Create</button>
                  )}
                  {togPerms.has("repositories.delete") ? (
                    <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer">Delete</button>
                  ) : (
                    <button className="px-2 py-1 rounded-lg text-[8px] font-semibold bg-surface border border-border text-muted-dark/40 cursor-not-allowed" disabled>Delete</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionProvider>
  );
}
