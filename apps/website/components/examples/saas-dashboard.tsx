"use client";

import { useState, useMemo } from "react";
import {
  PermissionProvider,
  Can,
  useAccessDecision,
} from "accessly";
import type { AccessDecision } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { saasDashboardExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Plans ────────────────────────────────────────────────────────── */

const PLANS = [
  { id: "free", label: "Free", badge: "Starter", color: "text-muted border-border" },
  { id: "pro", label: "Pro", badge: "Popular", color: "text-accent border-primary/30 bg-primary/5" },
  { id: "enterprise", label: "Enterprise", badge: "Advanced", color: "text-warning border-warning/30 bg-warning/5" },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

const PLAN_CONFIG: Record<PlanId, { permissions: string[]; flags: string[] }> = {
  free: {
    permissions: ["billing.view", "reports.view"],
    flags: [],
  },
  pro: {
    permissions: ["billing.view", "billing.update", "team.invite", "reports.view", "reports.export"],
    flags: ["features.advancedReports", "features.teamManagement"],
  },
  enterprise: {
    permissions: ["billing.view", "billing.update", "team.invite", "team.remove", "reports.view", "reports.export"],
    flags: ["features.advancedReports", "features.teamManagement", "features.auditLogs"],
  },
};

/* ── Mock data ────────────────────────────────────────────────────── */

const MOCK_TEAM = [
  { id: 1, name: "Alice Chen", email: "alice@acme.com", role: "admin" },
  { id: 2, name: "Bob Kim", email: "bob@acme.com", role: "member" },
  { id: 3, name: "Carol Davis", email: "carol@acme.com", role: "member" },
];

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function SaasDashboardExample() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");

  const plan = PLAN_CONFIG[selectedPlan];

  const accessModel = useMemo(
    () => ({
      user: { id: "usr_saas_demo", roles: [selectedPlan] },
      permissions: plan.permissions,
      flags: plan.flags,
      isLoading: false,
    }),
    [selectedPlan],
  );

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="saas-dashboard.tsx" />
      }
    >
      <PermissionProvider access={accessModel}>
        <div className="space-y-5">
          {/* Plan Selector */}
          <PlanSelector
            plans={PLANS}
            selected={selectedPlan}
            onSelect={setSelectedPlan}
          />

          {/* Feature & Permission Summary */}
          <FeatureSummary plan={selectedPlan} flags={plan.flags} permissions={plan.permissions} />

          {/* Mini SaaS UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">Acme Corp</span>
                <PlanBadge plan={selectedPlan} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                <span>acme org</span>
                <ActiveDot />
              </div>
            </div>

            <div className="p-4 space-y-5">
              {/* Billing Section */}
              <BillingSection plan={selectedPlan} />

              {/* Reports Section — gated by flag */}
              <Can
                permission={{ flag: "features.advancedReports" }}
                fallback={<UpgradePrompt feature="Advanced Reports" />}
              >
                <ReportsSection plan={selectedPlan} />
              </Can>

              {/* Team Section — gated by flag */}
              <Can
                permission={{ flag: "features.teamManagement" }}
                fallback={<UpgradePrompt feature="Team Management" />}
              >
                <TeamSection plan={selectedPlan} />
              </Can>

              {/* Audit Logs — gated by flag */}
              <Can
                permission={{ flag: "features.auditLogs" }}
                fallback={<UpgradePrompt feature="Audit Logs" />}
              >
                <AuditLogsSection />
              </Can>
            </div>
          </div>

          {/* Decision Output */}
          <DecisionOutputs plan={selectedPlan} />
        </div>
      </PermissionProvider>
    </ExampleShell>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                     */
/* ════════════════════════════════════════════════════════════════════ */

function PlanSelector({
  plans,
  selected,
  onSelect,
}: {
  plans: readonly { id: string; label: string; badge: string; color: string }[];
  selected: string;
  onSelect: (id: any) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono mr-1">
        Plan:
      </span>
      {plans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer",
            selected === plan.id
              ? plan.color + " shadow-sm"
              : "bg-surface border-border text-muted hover:text-foreground hover:border-border-hover",
          )}
        >
          {plan.label}
          {selected === plan.id && (
            <span className="ml-1.5 text-[8px] font-mono opacity-70">({plan.badge})</span>
          )}
        </button>
      ))}
    </div>
  );
}

function PlanBadge({ plan }: { plan: PlanId }) {
  const colors: Record<PlanId, string> = {
    free: "bg-surface text-muted-dark border-border",
    pro: "bg-primary/10 text-accent border-primary/20",
    enterprise: "bg-warning/10 text-warning border-warning/20",
  };
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", colors[plan])}>
      {plan}
    </span>
  );
}

function FeatureSummary({ plan, flags, permissions }: { plan: PlanId; flags: string[]; permissions: string[] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">🚩 Feature Flags</span>
        <span className="text-[9px] font-mono text-muted-dark">{flags.length} / 3 active</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(config.allFlags ?? []).map((flag) => {
          const has = flags.includes(flag);
          return (
            <span
              key={flag}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all duration-150",
                has
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-surface-2 text-muted-dark border-border/40",
              )}
            >
              {has ? "✦" : "○"} {flag}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border/30">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">🔑 Permissions</span>
        <span className="text-[9px] font-mono text-muted-dark">{permissions.length} active</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {config.allPermissions.map((perm) => {
          const has = permissions.includes(perm);
          return (
            <span
              key={perm}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all duration-150",
                has
                  ? "bg-success-bg text-success border-success/20"
                  : "bg-surface-2 text-muted-dark border-border/40",
              )}
            >
              {has ? "✓" : "○"} {perm}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function BillingSection({ plan }: { plan: PlanId }) {
  const decision = useAccessDecision("billing.update");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">💳 Billing</span>
        <Can
          permission="billing.update"
          fallback={
            <span className="text-[9px] text-muted-dark italic">View only</span>
          }
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary text-white cursor-pointer border-none shadow-sm shadow-primary/20 hover:shadow-md transition-all duration-150">
            Manage Plan
          </button>
        </Can>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
          <div className="text-[9px] text-muted font-mono mb-1">Current Plan</div>
          <div className="font-bold text-foreground capitalize">{plan}</div>
          {plan === "free" && (
            <div className="text-[9px] text-warning mt-1 flex items-center gap-1">
              <span>⚠️</span> Upgrade for more features
            </div>
          )}
        </div>
        <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
          <div className="text-[9px] text-muted font-mono mb-1">Monthly Spend</div>
          <div className="font-bold text-foreground">
            {plan === "free" ? "$0" : plan === "pro" ? "$29" : "$99"}
          </div>
          <div className={cn("text-[9px] font-mono mt-1", decision.allowed ? "text-success" : "text-muted-dark")}>
            {decision.allowed ? "Can update billing" : "View only"}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsSection({ plan }: { plan: PlanId }) {
  const exportDecision = useAccessDecision("reports.export");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">📊 Reports</span>
        <Can
          permission="reports.export"
          fallback={
            <span className="text-[9px] text-muted-dark italic flex items-center gap-1">
              🔒 Upgrade to export
            </span>
          }
        >
          <button
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer",
              exportDecision.allowed
                ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                : "bg-surface border-border text-muted-dark cursor-not-allowed",
            )}
            disabled={!exportDecision.allowed}
            title={exportDecision.reason}
          >
            Export CSV
          </button>
        </Can>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface/30 border border-border/50">
          <div>
            <div className="text-[11px] font-medium text-foreground">Q3 Revenue Report</div>
            <div className="text-[9px] text-muted font-mono">Updated 2 hours ago</div>
          </div>
          <span className="text-[9px] font-mono text-success">Completed</span>
        </div>
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface/30 border border-border/50">
          <div>
            <div className="text-[11px] font-medium text-foreground">User Growth Analysis</div>
            <div className="text-[9px] text-muted font-mono">Updated yesterday</div>
          </div>
          <span className="text-[9px] font-mono text-success">Completed</span>
        </div>
      </div>
      {/* Export decision detail */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-muted">useAccessDecision("reports.export"):</span>
          <span className={cn(
            "font-bold",
            exportDecision.allowed ? "text-success" : "text-danger",
          )}>
            {exportDecision.allowed ? "ALLOWED" : "DENIED"}
          </span>
          <span className="text-muted-dark">· reason: {exportDecision.reason}</span>
        </div>
      </div>
    </div>
  );
}

function TeamSection({ plan }: { plan: PlanId }) {
  const canRemove = useAccessDecision("team.remove");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">👥 Team</span>
        <Can
          permission="team.invite"
          fallback={
            <span className="text-[9px] text-muted-dark italic">Invite unavailable</span>
          }
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20 hover:shadow-md transition-all duration-150">
            + Invite Member
          </button>
        </Can>
      </div>
      <div className="divide-y divide-border/30">
        {MOCK_TEAM.map((member) => (
          <div key={member.id} className="flex items-center justify-between py-2 text-xs">
            <div>
              <span className="text-foreground font-medium">{member.name}</span>
              <span className="text-muted ml-2">{member.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-muted-dark bg-surface px-1.5 py-0.5 rounded border border-border">
                {member.role}
              </span>
              {canRemove.allowed ? (
                <button className="px-2 py-1 rounded-lg text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150">
                  Remove
                </button>
              ) : (
                <span className="text-[9px] text-muted-dark italic">🔒</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Remove decision detail */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-muted">useAccessDecision("team.remove"):</span>
          <span className={cn(
            "font-bold",
            canRemove.allowed ? "text-success" : "text-danger",
          )}>
            {canRemove.allowed ? "ALLOWED" : "DENIED"}
          </span>
          <span className="text-muted-dark">· reason: {canRemove.reason}</span>
        </div>
      </div>
    </div>
  );
}

function AuditLogsSection() {
  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">📋 Audit Logs</span>
        <span className="text-[9px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
          Enterprise Feature
        </span>
      </div>
      <div className="space-y-2">
        <AuditLogItem action="User invited" actor="alice@acme.com" time="2 min ago" />
        <AuditLogItem action="Report exported" actor="bob@acme.com" time="15 min ago" />
        <AuditLogItem action="Billing plan updated" actor="alice@acme.com" time="1 hour ago" />
      </div>
    </div>
  );
}

function AuditLogItem({ action, actor, time }: { action: string; actor: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface/30 border border-border/50 text-[10px]">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-foreground">{action}</span>
      </div>
      <div className="text-muted font-mono">{actor} · {time}</div>
    </div>
  );
}

function UpgradePrompt({ feature }: { feature: string }) {
  return (
    <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-warning">🔒</span>
        <span className="text-xs text-muted">
          {feature} requires an upgraded plan
        </span>
      </div>
      <button className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
        Upgrade
      </button>
    </div>
  );
}

function ActiveDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span className="absolute inline-flex w-full h-full rounded-full bg-success opacity-75 animate-ping" />
      <span className="relative inline-flex w-2 h-2 rounded-full bg-success" />
    </span>
  );
}

function DecisionOutputs({ plan }: { plan: PlanId }) {
  const planConfig = PLAN_CONFIG[plan];
  const allPerms = config.allPermissions;
  const allFlags = config.allFlags ?? [];

  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>🎯</span> Decision Outputs (useAccessDecision)
      </span>

      <div className="space-y-3">
        {/* Permission decisions */}
        <div>
          <span className="text-[9px] font-mono text-muted-dark mb-2 block">Permissions</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allPerms.map((perm) => {
              const has = planConfig.permissions.includes(perm);
              return (
                <div
                  key={perm}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono border",
                    has
                      ? "bg-success-bg border-success/20 text-success"
                      : "bg-danger-subtle border-danger/20 text-danger",
                  )}
                >
                  <span>{has ? "✓" : "✗"}</span>
                  <span className="truncate">{perm}</span>
                  <span className="ml-auto text-[8px] opacity-70">
                    {has ? "allowed" : "denied"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flag decisions */}
        <div className="pt-2 border-t border-border/30">
          <span className="text-[9px] font-mono text-muted-dark mb-2 block">Feature Flags</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allFlags.map((flag) => {
              const has = planConfig.flags.includes(flag);
              return (
                <div
                  key={flag}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono border",
                    has
                      ? "bg-accent/10 border-accent/20 text-accent"
                      : "bg-surface-2 border-border/40 text-muted-dark",
                  )}
                >
                  <span>{has ? "✦" : "○"}</span>
                  <span className="truncate">{flag}</span>
                  <span className="ml-auto text-[8px] opacity-70">
                    {has ? "active" : "inactive"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
