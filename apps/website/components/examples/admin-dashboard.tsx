"use client";

import { useState, useMemo } from "react";
import {
  PermissionProvider,
  Can,
  Cannot,
  usePermission,
  useAccessDecision,
  filterNavigation,
  ProtectedRoute,
} from "accessly";
import type { NavigationItem, AccessDecision } from "accessly";
import { CodeBlock } from "@/components/ui/code-block";
import { adminDashboardExample as config } from "@/data/examples";
import { ExampleShell } from "./example-shell";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Navigation items ─────────────────────────────────────────────── */

const NAV_ITEMS: NavigationItem[] = [
  { label: "Dashboard", href: "/", permission: "dashboard.view" },
  {
    label: "Users",
    permission: "users.view",
    children: [
      { label: "All Users", href: "/users", permission: "users.view" },
      { label: "Create User", href: "/users/create", permission: "users.create" },
    ],
  },
  {
    label: "Settings",
    permission: "settings.view",
    children: [
      { label: "General", href: "/settings", permission: "settings.view" },
      { label: "Security", href: "/settings/security", permission: "settings.update" },
    ],
  },
];

/* ── Mock users table ─────────────────────────────────────────────── */

const MOCK_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "editor" },
  { id: 3, name: "Charlie Lee", email: "charlie@example.com", role: "viewer" },
  { id: 4, name: "Diana Wang", email: "diana@example.com", role: "manager" },
];

/* ── Role button config ───────────────────────────────────────────── */

const ROLES = [
  { id: "admin", label: "Admin", color: "bg-danger/10 text-danger border-danger/20" },
  { id: "manager", label: "Manager", color: "bg-warning/10 text-warning border-warning/20" },
  { id: "viewer", label: "Viewer", color: "bg-info/10 text-info border-info/20" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

/* ── Role permissions map ─────────────────────────────────────────── */

const ROLE_PERMISSIONS: Record<RoleId, string[]> = {
  admin: ["dashboard.view", "users.view", "users.create", "users.delete", "settings.view", "settings.update"],
  manager: ["dashboard.view", "users.view", "users.create", "settings.view", "settings.update"],
  viewer: ["dashboard.view", "users.view", "settings.view"],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ════════════════════════════════════════════════════════════════════ */

export function AdminDashboardExample() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("admin");

  const rolePerms = ROLE_PERMISSIONS[selectedRole];

  /* Build the access model */
  const accessModel = useMemo(
    () => ({
      user: { id: "usr_demo", roles: [selectedRole] },
      permissions: [] as string[],
      isLoading: false,
    }),
    [selectedRole],
  );

  /* Filter navigation based on role */
  const filteredNav = useMemo(
    () => filterNavigation(NAV_ITEMS, accessModel),
    [NAV_ITEMS, accessModel],
  );

  return (
    <ExampleShell
      title={config.title}
      description={config.description}
      icon={config.icon}
      apisTested={config.apisTested}
      explanation={config.codeExplanation}
      codeSnippet={
        <CodeBlock code={config.codeSnippet} language="tsx" title="admin-dashboard.tsx" />
      }
    >
      <PermissionProvider
        access={accessModel}
        rolePermissions={ROLE_PERMISSIONS}
      >
        <div className="space-y-5">
          {/* Role Selector */}
          <RoleSelector
            roles={ROLES}
            selected={selectedRole}
            onSelect={setSelectedRole}
          />

          {/* Permission Summary */}
          <PermissionSummary
            role={selectedRole}
            permissions={rolePerms}
          />

          {/* Mini Admin UI */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* App Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-foreground">Admin Panel</span>
                <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-border">
                  {selectedRole.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                <span>user_{selectedRole.slice(0, 3)}</span>
                <ActiveDot />
              </div>
            </div>

            <div className="flex min-h-[280px]">
              {/* Sidebar */}
              <div className="w-44 bg-[#09090c] border-r border-border p-3 shrink-0">
                <span className="text-[8px] font-bold text-muted-dark uppercase tracking-widest mb-2 block font-mono">
                  Navigation
                </span>
                <nav className="space-y-0.5">
                  {filteredNav.map((item) => (
                    <NavItem
                      key={item.label}
                      item={item}
                      depth={0}
                    />
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4">
                {/* ProtectedRoute demo */}
                <ProtectedRoute
                  permission="dashboard.view"
                  fallback={<NoAccess message="Dashboard access denied" />}
                >
                  <DashboardContent selectedRole={selectedRole} />
                </ProtectedRoute>
              </div>
            </div>
          </div>

          {/* Decision Output */}
          <DecisionOutput role={selectedRole} permissions={rolePerms} />
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

function PermissionSummary({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono">
          🔑 Active Permissions
        </span>
        <span className="text-[9px] font-mono text-muted-dark">
          {permissions.length} / 6
        </span>
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

function NavItem({
  item,
  depth,
}: {
  item: NavigationItem;
  depth: number;
}) {
  const allowed = usePermission(item.permission ?? "dashboard.view");
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-150",
          allowed
            ? "text-foreground bg-surface-hover border border-border-subtle"
            : "text-muted-dark",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {item.children && item.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-dark hover:text-foreground cursor-pointer bg-transparent border-none p-0 w-3 h-3 flex items-center justify-center text-[8px]"
          >
            {expanded ? "▾" : "▸"}
          </button>
        )}
        <span>{item.label}</span>
        {item.permission && (
          <span
            className={cn(
              "ml-auto text-[7px] font-mono px-1 rounded",
              allowed ? "text-accent bg-primary/10" : "text-muted-dark bg-surface",
            )}
          >
            {allowed ? "✓" : "○"}
          </span>
        )}
      </div>
      {item.children && expanded && (
        <div>
          {item.children.map((child) => (
            <NavItem key={child.label} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardContent({ selectedRole }: { selectedRole: string }) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Users" value="1,284" change="+12" />
        <StatCard label="Active Sessions" value="48" change="+3" />
        <StatCard label="Reports" value="23" change="-2" />
      </div>

      {/* Users Section — gated */}
      <Can permission="users.view" fallback={
        <div className="rounded-lg border border-border/50 bg-surface/20 p-6 text-center">
          <span className="text-sm text-muted italic">🔒 Users section hidden — requires users.view</span>
        </div>
      }>
        <div className="rounded-lg border border-border bg-surface/20">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-xs font-bold text-foreground">Users</span>
            <div className="flex items-center gap-2">
              {/* Cannot example */}
              <Cannot
                permission="users.create"
                fallback={
                  <span className="text-[10px] text-muted-dark italic flex items-center gap-1">
                    🔒 No create access
                  </span>
                }
              >
                <CreateUserButton />
              </Cannot>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {MOCK_USERS.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-2.5 text-xs"
              >
                <div>
                  <span className="text-foreground font-medium">{user.name}</span>
                  <span className="text-muted ml-2">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-muted-dark bg-surface px-1.5 py-0.5 rounded border border-border">
                    {user.role}
                  </span>
                  {/* Delete button — gated with Cannot fallback */}
                  <Cannot
                    permission="users.delete"
                    fallback={
                      <span className="text-[9px] text-muted-dark italic">🔒</span>
                    }
                  >
                    <DeleteUserButton userId={user.id} />
                  </Cannot>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Can>

      {/* Settings Section — gated with ProtectedRoute-like check */}
      <Can permission="settings.view" fallback={
        <div className="rounded-lg border border-border/50 bg-surface/20 p-6 text-center">
          <span className="text-sm text-muted italic">🔒 Settings hidden — requires settings.view</span>
        </div>
      }>
        <div className="rounded-lg border border-border bg-surface/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground">Settings</span>
            <Can
              permission="settings.update"
              fallback={<span className="text-[9px] text-muted-dark italic">Read only</span>}
            >
              <SaveButton />
            </Can>
          </div>
          <div className="space-y-3">
            <SettingField label="Site Name" value="Accessly Admin" readOnly={!ROLE_PERMISSIONS[selectedRole as RoleId].includes("settings.update")} />
            <SettingField label="Timezone" value="UTC" readOnly={!ROLE_PERMISSIONS[selectedRole as RoleId].includes("settings.update")} />
          </div>
        </div>
      </Can>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  const isPositive = change.startsWith("+");
  return (
    <div className="rounded-lg border border-border bg-surface/30 p-3">
      <div className="text-[9px] text-muted font-mono mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className={cn("text-[10px] font-mono mt-1", isPositive ? "text-success" : "text-danger")}>
        {change}
      </div>
    </div>
  );
}

function CreateUserButton() {
  return (
    <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-primary to-violet text-white cursor-pointer border-none shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all duration-150">
      + Create User
    </button>
  );
}

function DeleteUserButton({ userId }: { userId: number }) {
  return (
    <button
      className="px-2 py-1 rounded-lg text-[9px] font-semibold bg-danger/10 border border-danger/20 text-danger cursor-pointer hover:bg-danger/20 transition-all duration-150"
      onClick={() => alert(`Delete user ${userId} — would require confirmation in production`)}
    >
      Delete
    </button>
  );
}

function SaveButton() {
  return (
    <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary text-white cursor-pointer border-none shadow-sm shadow-primary/20 hover:shadow-md transition-all duration-150">
      Save Changes
    </button>
  );
}

function SettingField({ label, value, readOnly }: { label: string; value: string; readOnly: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted font-mono w-24">{label}</span>
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

function NoAccess({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-danger/20 bg-danger-subtle p-4 text-center">
      <span className="text-sm text-danger font-medium">🚫 {message}</span>
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

function DecisionOutput({ role, permissions }: { role: string; permissions: string[] }) {
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
              <span>{perm}</span>
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
