"use client";

import { useState } from "react";

/* ── Playground data ───────────────────────── */

interface PlayTabData {
  label: string;
  check: string;
  allowed: boolean;
  decision: string;
  desc: string;
}

function getPlayData(activeTab: number): PlayTabData {
  switch (activeTab) {
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
}

/* ── Sidebar nav items ─────────────────────── */

interface NavItem {
  label: string;
  id: number;
  icon: string;
  badge?: string;
  danger?: boolean;
}

const navItems: NavItem[] = [
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
];

/* ── Component ─────────────────────────────── */

/**
 * Playground — interactive live-execution pipeline embedded in the hero.
 *
 * Users can click sidebar routes to see how Accessly resolves each
 * permission check in real time. Visually styled as a code terminal
 * with three columns: AccessModel → Engine → Decision.
 */
export function Playground() {
  const [activeTab, setActiveTab] = useState(1);
  const data = getPlayData(activeTab);

  return (
    <>
      {/* Subtle glow behind the playground panel */}
      <div className="absolute inset-x-[-40px] bottom-[-40px] top-[40px] bg-[radial-gradient(ellipse_at_50%_80%,rgba(99,102,241,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="panel-dark relative overflow-hidden rounded-[18px]">
        {/* ── Window chrome ── */}
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

        {/* ── Playground body ── */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr_1fr] min-h-[360px]">
          {/* ─── Col 1 — Sidebar ─── */}
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
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs w-full text-left cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-primary/8 border border-primary/15 text-foreground font-semibold"
                        : "border border-transparent text-muted font-normal hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1 py-[1px] rounded border ${
                          item.danger
                            ? "text-danger border-danger/20 bg-danger/5"
                            : "text-accent-foreground border-primary/20 bg-primary/5"
                        }`}
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

          {/* ─── Col 2 — AccessModel ─── */}
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

          {/* ─── Col 3 — Engine ─── */}
          <div className="flex flex-col gap-3 p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
            <div className="text-[10px] font-mono text-accent-foreground uppercase tracking-widest">
              02 / Engine
            </div>
            <div className="flex-1 bg-black/30 rounded-lg p-3 md:p-3.5 border border-border-light flex flex-col gap-2">
              <div className="text-[10px] font-mono text-muted">
                checking:
              </div>
              <code className="block text-[11px] px-2.5 py-1.5 bg-primary/7 rounded-md border border-primary/15 text-accent font-mono">
                {data.check}
              </code>
              <div className="mt-1 text-[10px] font-mono text-muted">
                strategy:{" "}
                <span className="text-accent-foreground">
                  direct + role_expansion
                </span>
              </div>
            </div>
          </div>

          {/* ─── Col 4 — Decision ─── */}
          <div className="flex flex-col gap-3 p-4 md:p-5">
            <div
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: data.allowed ? "#10b981" : "#ef4444" }}
            >
              03 / Decision {data.allowed ? "✓" : "✕"}
            </div>
            <pre
              className="m-0 flex-1 text-[11px] font-mono leading-relaxed rounded-lg p-3 md:p-3.5 border overflow-auto"
              style={{
                color: data.allowed
                  ? "rgba(16,185,129,0.85)"
                  : "rgba(239,68,68,0.85)",
                background: data.allowed
                  ? "rgba(16,185,129,0.04)"
                  : "rgba(239,68,68,0.04)",
                borderColor: data.allowed
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
              }}
            >
              {data.decision}
            </pre>

            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
              style={{
                borderColor: data.allowed
                  ? "rgba(16,185,129,0.2)"
                  : "rgba(239,68,68,0.2)",
                background: data.allowed
                  ? "rgba(16,185,129,0.05)"
                  : "rgba(239,68,68,0.05)",
              }}
            >
              <span
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: data.allowed
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(239,68,68,0.12)",
                  color: data.allowed ? "#10b981" : "#ef4444",
                }}
              >
                {data.allowed ? "✓" : "✕"}
              </span>
              <div>
                <div className="text-xs font-semibold text-foreground leading-tight">
                  {data.label}
                </div>
                <div className="text-[10px] text-muted font-mono">
                  {data.desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
