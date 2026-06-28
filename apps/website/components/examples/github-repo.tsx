"use client";

import { useState, useMemo } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
  ProtectedRoute,
} from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { githubRepoExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Roles ────────────────────────────────────────────────────────── */

const ROLES = [
  { id: "owner", label: "Owner", color: "text-danger bg-danger/10 border-danger/20" },
  { id: "maintainer", label: "Maintainer", color: "text-warning bg-warning/10 border-warning/20" },
  { id: "contributor", label: "Contributor", color: "text-accent bg-primary/10 border-primary/20" },
  { id: "viewer", label: "Viewer", color: "text-muted bg-surface border-border" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const ROLE_PERMISSIONS: Record<RoleId, string[]> = {
  owner: [
    "repositories.view",
    "repositories.create",
    "repositories.write",
    "repositories.delete",
    "repositories.settings.view",
    "repositories.settings.update",
    "branches.create",
    "branches.delete",
    "pullRequests.merge",
    "issues.manage",
  ],
  maintainer: [
    "repositories.view",
    "repositories.write",
    "repositories.settings.view",
    "branches.create",
    "branches.delete",
    "pullRequests.merge",
    "issues.manage",
  ],
  contributor: [
    "repositories.view",
    "repositories.write",
    "branches.create",
    "issues.manage",
  ],
  viewer: [
    "repositories.view",
  ],
};

/* ── Mock data ────────────────────────────────────────────────────── */

const MOCK_BRANCHES = [
  { id: 1, name: "main", protected: true, updated: "2 hours ago" },
  { id: 2, name: "feature/new-ui", protected: false, updated: "5 min ago" },
  { id: 3, name: "fix/auth-bug", protected: false, updated: "1 hour ago" },
  { id: 4, name: "release/v2.1", protected: true, updated: "3 days ago" },
];

const MOCK_PRS = [
  { id: 1, title: "Add dark mode support", author: "contributor1", status: "open" as const },
  { id: 2, title: "Fix login redirect loop", author: "contributor2", status: "open" as const },
  { id: 3, title: "Update API documentation", author: "maintainer1", status: "merged" as const },
];

const MOCK_ISSUES = [
  { id: 1, title: "Button alignment broken in Safari", label: "bug" as const, assignee: "alice" },
  { id: 2, title: "Add unit tests for permission engine", label: "enhancement" as const, assignee: "bob" },
  { id: 3, title: "Performance regression on dashboard", label: "bug" as const, assignee: null },
];

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function GithubRepoExample() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("maintainer");
  const [showSettings, setShowSettings] = useState(false);

  const rolePerms = ROLE_PERMISSIONS[selectedRole];

  const accessModel = useMemo(
    () => ({
      user: { id: "usr_repo_demo", roles: [selectedRole] },
      permissions: rolePerms,
      isLoading: false,
    }),
    [selectedRole],
  );

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="github-repo.tsx" />
      }
    >
      <PermissionProvider access={accessModel}>
        <div className="space-y-5">
          {/* Role Selector */}
          <RoleSelector roles={ROLES} selected={selectedRole} onSelect={setSelectedRole} />

          {/* Permission Summary */}
          <PermissionSummary permissions={rolePerms} />

          {/* Mini Repo UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Repo Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">🐙 accessly/accessly</span>
                <RepoBadge role={selectedRole} />
              </div>
              <div className="flex items-center gap-2">
                <Can
                  permission="repositories.write"
                  fallback={<span className="text-[9px] text-muted-dark italic">🔒 Read-only</span>}
                >
                  <span className="text-[9px] font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> Write access
                  </span>
                </Can>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-[#09090c]">
              {["Code", "Issues", "Pull Requests", "Settings"].map((tab) => {
                const isSettings = tab === "Settings";
                const perm = isSettings ? "repositories.settings.view" : "repositories.view";
                return (
                  <Can key={tab} permission={perm} fallback={null}>
                    <button
                      onClick={() => isSettings && setShowSettings(!showSettings)}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-medium border transition-all duration-100 cursor-pointer",
                        isSettings && showSettings
                          ? "bg-primary/10 text-accent border-primary/20"
                          : "bg-transparent border-transparent text-muted hover:text-foreground hover:bg-surface-hover",
                      )}
                    >
                      {tab}
                      {isSettings && <span className="ml-1 text-[8px] text-muted-dark">🔒</span>}
                    </button>
                  </Can>
                );
              })}
            </div>

            {/* Content Area */}
            {showSettings ? (
              <SettingsPanel role={selectedRole} />
            ) : (
              <div className="p-4 space-y-5">
                {/* Repository Overview */}
                <RepoOverview role={selectedRole} />

                {/* Branch Actions */}
                <BranchSection role={selectedRole} />

                {/* Pull Requests */}
                <PRSection role={selectedRole} />

                {/* Issues */}
                <IssuesSection role={selectedRole} />
              </div>
            )}
          </div>

          {/* Decision Output */}
          <DecisionOutputs permissions={rolePerms} />
        </div>
      </PermissionProvider>
    </ExampleShell>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                     */
/* ════════════════════════════════════════════════════════════════════ */

function RoleSelector({
  roles,
  selected,
  onSelect,
}: {
  roles: readonly { id: string; label: string; color: string }[];
  selected: string;
  onSelect: (id: any) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono mr-1">
        Role:
      </span>
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer",
            selected === role.id
              ? role.color + " shadow-sm"
              : "bg-surface border-border text-muted hover:text-foreground hover:border-border-hover",
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}

function RepoBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    owner: "bg-danger/10 text-danger border-danger/20",
    maintainer: "bg-warning/10 text-warning border-warning/20",
    contributor: "bg-primary/10 text-accent border-primary/20",
    viewer: "bg-surface text-muted-dark border-border",
  };
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", colors[role] || "")}>
      {role}
    </span>
  );
}

function PermissionSummary({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">🔑 Permissions</span>
        <span className="text-[9px] font-mono text-muted-dark">{permissions.length} / {config.allPermissions.length}</span>
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

function RepoOverview({ role }: { role: RoleId }) {
  const canCreate = usePermission("repositories.create");
  const canWrite = usePermission("repositories.write");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">📁 Repository Overview</span>
        <div className="flex items-center gap-2">
          <Can
            permission="repositories.create"
            fallback={<span className="text-[9px] text-muted-dark italic">🔒 Fork restricted</span>}
          >
            <button className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer",
              canCreate
                ? "bg-primary text-white border-transparent shadow-sm shadow-primary/20"
                : "bg-surface border-border text-muted-dark cursor-not-allowed",
            )}>
              Fork
            </button>
          </Can>
          <Can
            permission="repositories.write"
            fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
          >
            <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary/10 border border-primary/20 text-accent cursor-pointer hover:bg-primary/20 transition-all duration-150">
              Clone
            </button>
          </Can>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <StatBox label="Stars" value="2.4k" />
        <StatBox label="Forks" value="384" />
        <StatBox label="Open Issues" value="12" />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-2.5 text-center">
      <div className="text-[9px] text-muted font-mono">{label}</div>
      <div className="text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function BranchSection({ role }: { role: RoleId }) {
  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">🌿 Branches</span>
        <Can
          permission="branches.create"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Branch creation restricted</span>}
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
            + New Branch
          </button>
        </Can>
      </div>
      <div className="divide-y divide-border/30">
        {MOCK_BRANCHES.map((branch) => {
          const canDelete = usePermission("branches.delete");
          return (
            <div key={branch.id} className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-mono font-medium">{branch.name}</span>
                {branch.protected && (
                  <span className="text-[8px] font-mono text-muted-dark bg-surface px-1.5 py-0.5 rounded border border-border">
                    protected
                  </span>
                )}
                <span className="text-[9px] text-muted">{branch.updated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {canDelete && !branch.protected ? (
                  <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150">
                    Delete
                  </button>
                ) : branch.protected ? (
                  <span className="text-[8px] text-muted-dark italic">Protected</span>
                ) : (
                  <span className="text-[8px] text-muted-dark italic">🔒</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PRSection({ role }: { role: RoleId }) {
  const mergeDecision = useAccessDecision("pullRequests.merge");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">🔀 Pull Requests</span>
      </div>
      <div className="divide-y divide-border/30">
        {MOCK_PRS.map((pr) => (
          <div key={pr.id} className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                pr.status === "open" ? "bg-success" : pr.status === "merged" ? "bg-accent" : "bg-danger",
              )} />
              <span className="text-foreground font-medium">{pr.title}</span>
              <span className="text-[9px] text-muted font-mono">by {pr.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 rounded border",
                pr.status === "open" ? "bg-success-bg text-success border-success/20" :
                pr.status === "merged" ? "bg-accent/10 text-accent border-accent/20" :
                "bg-danger-subtle text-danger border-danger/20",
              )}>
                {pr.status}
              </span>
              {pr.status === "open" && (
                <Can
                  permission="pullRequests.merge"
                  fallback={<span className="text-[9px] text-muted-dark italic">🔒</span>}
                >
                  <button
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-semibold border transition-all duration-150 cursor-pointer",
                      mergeDecision.allowed
                        ? "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                        : "bg-surface border-border text-muted-dark cursor-not-allowed",
                    )}
                    disabled={!mergeDecision.allowed}
                  >
                    Merge
                  </button>
                </Can>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-border/30">
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-muted">useAccessDecision("pullRequests.merge"):</span>
          <span className={cn("font-bold", mergeDecision.allowed ? "text-success" : "text-danger")}>
            {mergeDecision.allowed ? "ALLOWED" : "DENIED"}
          </span>
          <span className="text-muted-dark">· reason: {mergeDecision.reason}</span>
        </div>
      </div>
    </div>
  );
}

function IssuesSection({ role }: { role: RoleId }) {
  const canManage = usePermission("issues.manage");

  return (
    <div className="rounded-lg border border-border bg-surface/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground">🐛 Issues</span>
        <Can
          permission="issues.manage"
          fallback={<span className="text-[9px] text-muted-dark italic">🔒 Cannot manage issues</span>}
        >
          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20">
            + New Issue
          </button>
        </Can>
      </div>
      <div className="divide-y divide-border/30">
        {MOCK_ISSUES.map((issue) => (
          <div key={issue.id} className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                issue.label === "bug" ? "bg-danger" : "bg-accent",
              )} />
              <span className="text-foreground font-medium">{issue.title}</span>
              <span className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 rounded border",
                issue.label === "bug" ? "bg-danger-bg text-danger border-danger/20" : "bg-accent/10 text-accent border-accent/20",
              )}>
                {issue.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted font-mono">
                {issue.assignee ?? "unassigned"}
              </span>
              {canManage && (
                <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-surface border border-border text-muted hover:text-foreground cursor-pointer transition-all duration-150">
                  Assign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel({ role }: { role: RoleId }) {
  const canUpdateSettings = usePermission("repositories.settings.update");
  const canDelete = usePermission("repositories.delete");

  return (
    <div className="p-4 space-y-5">
      {/* Settings — gated by ProtectedRoute at tab level, but we double-check */}
      <ProtectedRoute
        permission="repositories.settings.view"
        fallback={
          <div className="p-6 text-center text-sm text-muted italic">
            🔒 You do not have access to repository settings.
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface/20 p-4">
            <span className="text-xs font-bold text-foreground mb-3 block">⚙️ Repository Settings</span>
            <div className="space-y-3">
              <SettingField label="Repository Name" value="accessly" readOnly={!canUpdateSettings} />
              <SettingField label="Default Branch" value="main" readOnly={!canUpdateSettings} />
              <SettingField label="Description" value="Explainable access control for React" readOnly={!canUpdateSettings} />
            </div>
            <Can
              permission="repositories.settings.update"
              fallback={<span className="text-[9px] text-muted-dark italic mt-2 block">View only — changes not permitted</span>}
            >
              <button className="mt-3 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-primary text-white cursor-pointer border-none shadow-sm shadow-primary/20">
                Save Settings
              </button>
            </Can>
          </div>

          {/* Danger Zone — only for roles with delete */}
          <Can
            permission="repositories.delete"
            fallback={
              <div className="rounded-lg border border-border/50 bg-surface/20 p-4 opacity-50">
                <span className="text-xs font-bold text-muted-dark">☠️ Danger Zone</span>
                <p className="text-[10px] text-muted-dark mt-1 italic">Delete repository requires owner-level access</p>
              </div>
            }
          >
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-danger">☠️ Danger Zone</span>
                  <p className="text-[10px] text-muted mt-1">This action permanently deletes the repository and all its data.</p>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-danger text-white cursor-pointer border-none shadow-sm shadow-danger/20 hover:bg-danger/90 transition-all duration-150"
                  onClick={() => alert("[QA] Delete repo triggered — would show confirmation modal in production")}
                >
                  Delete Repository
                </button>
              </div>
            </div>
          </Can>
        </div>
      </ProtectedRoute>
    </div>
  );
}

function SettingField({ label, value, readOnly }: { label: string; value: string; readOnly: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted font-mono w-32">{label}</span>
      <div className={cn(
        "flex-1 px-3 py-1.5 rounded text-xs border",
        readOnly
          ? "bg-surface-2 border-border/40 text-muted cursor-not-allowed"
          : "bg-surface border-border text-foreground",
      )}>
        {value}
        {readOnly && <span className="ml-2 text-[8px] text-muted-dark">(read only)</span>}
      </div>
    </div>
  );
}

function DecisionOutputs({ permissions }: { permissions: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/30 p-4">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
        <span>🎯</span> Decision Outputs (useAccessDecision)
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {config.allPermissions.map((perm) => {
          const has = permissions.includes(perm);
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
  );
}
