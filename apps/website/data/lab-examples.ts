import type { BackendPreset, ReplayStep } from "@/types/lab";

/* ── Backend Presets ── */

export const BACKEND_PRESETS: BackendPreset[] = [
  {
    id: "laravel",
    name: "Laravel",
    description: "all_permissions array with user roles",
    icon: "🐘",
    color: "#ef4444",
    payload: {
      user: { id: "usr_laravel_dev", name: "Alex Dev", roles: ["developer"] },
      all_permissions: [
        "repositories.read",
        "repositories.write",
        "billing.view",
      ],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.all_permissions,
  user: { id: src.user.id, name: src.user.name, roles: src.user.roles },
}))`,
    permissions: ["repositories.read", "repositories.write", "billing.view"],
    roles: ["developer"],
  },
  {
    id: "nestjs",
    name: "NestJS",
    description: "abilities array with user context",
    icon: "🟢",
    color: "#10b981",
    payload: {
      user: { id: "usr_nest_editor", name: "Sarah Editor", roles: ["editor"] },
      abilities: ["repositories.read", "posts.create", "posts.write"],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.abilities,
  roles: src.user.roles,
  user: { id: src.user.id, name: src.user.name },
}))`,
    permissions: ["repositories.read", "posts.create", "posts.write"],
    roles: ["editor"],
  },
  {
    id: "aspnet",
    name: "ASP.NET",
    description: "claims-based auth with typed permissions",
    icon: "🔷",
    color: "#3b82f6",
    payload: {
      nameid: "usr_asp_admin",
      name: "Jordan Admin",
      role: ["Administrator"],
      claims: [
        { type: "permission", value: "repositories.read" },
        { type: "permission", value: "repositories.write" },
        { type: "permission", value: "billing.view" },
      ],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.claims
    .filter(c => c.type === "permission")
    .map(c => c.value),
  roles: src.role,
  user: { id: src.nameid, name: src.name },
}))`,
    permissions: ["repositories.read", "repositories.write", "billing.view"],
    roles: ["Administrator"],
  },
  {
    id: "springboot",
    name: "Spring Boot",
    description: "authorities list with ROLE_ prefix",
    icon: "🍃",
    color: "#22c55e",
    payload: {
      sub: "usr_spring_mgr",
      name: "Taylor Manager",
      roles: ["ROLE_MANAGER"],
      authorities: [
        { authority: "repositories.read" },
        { authority: "repositories.write" },
      ],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.authorities.map(a => a.authority),
  roles: src.roles.map(r => r.replace("ROLE_", "").toLowerCase()),
  user: { id: src.sub, name: src.name },
}))`,
    permissions: ["repositories.read", "repositories.write"],
    roles: ["manager"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Postgres RLS-style permission scope",
    icon: "⚡",
    color: "#f59e0b",
    payload: {
      aud: "authenticated",
      sub: "usr_supabase_user",
      role: "authenticated",
      email: "user@example.com",
      app_metadata: {
        plan: "pro",
        permissions: ["repositories.read", "billing.view"],
      },
      user_metadata: { name: "Sam User", roles: ["member"] },
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.app_metadata.permissions,
  roles: src.user_metadata.roles,
  user: { id: src.sub, name: src.user_metadata.name },
}))`,
    permissions: ["repositories.read", "billing.view"],
    roles: ["member"],
  },
  {
    id: "express",
    name: "Express",
    description: "session-based auth with simple roles",
    icon: "🚂",
    color: "#8b5cf6",
    payload: {
      session: {
        user: {
          id: "usr_express_user",
          username: "chris_dev",
          scope: ["repositories.read", "repositories.write", "users.view"],
        },
        roles: ["developer"],
        authenticated: true,
      },
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.session.user.scope,
  roles: src.session.roles,
  user: {
    id: src.session.user.id,
    name: src.session.user.username,
  },
}))`,
    permissions: ["repositories.read", "repositories.write", "users.view"],
    roles: ["developer"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Paste any backend JSON shape",
    icon: "⚙️",
    color: "#6b7280",
    payload: {
      user: { id: "usr_custom", roles: ["admin"] },
      permissions: ["repositories.read", "repositories.write", "settings.manage"],
    },
    adapterCode: `createAdapter((src) => ({
  permissions: src.permissions,
  roles: src.user.roles,
  user: { id: src.user.id },
}))`,
    permissions: ["repositories.read", "repositories.write", "settings.manage"],
    roles: ["admin"],
  },
];

/* ── Decision Replay Steps ── */

export const REPLAY_STEPS: ReplayStep[] = [
  {
    id: "received",
    label: "Backend response received",
    description: "Raw payload from your backend arrives",
    icon: "📥",
    timing: "00ms",
  },
  {
    id: "adapter",
    label: "Adapter normalizes payload",
    description: "Backend-specific adapter transforms shape into AccessModel",
    icon: "🔄",
    timing: "02ms",
  },
  {
    id: "model",
    label: "AccessModel generated",
    description: "Normalized permissions, roles, and user context ready",
    icon: "📋",
    timing: "04ms",
  },
  {
    id: "check",
    label: "Permission checked",
    description: "Requested permission is looked up in the AccessModel",
    icon: "🔍",
    timing: "06ms",
  },
  {
    id: "decision",
    label: "Decision resolved",
    description: "Match found — direct, wildcard, or role expansion",
    icon: "⚖️",
    timing: "08ms",
  },
  {
    id: "ui",
    label: "React UI updated",
    description: "Can component re-renders based on decision",
    icon: "🖥️",
    timing: "10ms",
  },
];

/* ── Common Permissions (for suggestions) ── */

export const COMMON_PERMISSIONS = [
  "repositories.read",
  "repositories.write",
  "repositories.create",
  "repositories.delete",
  "repositories.admin",
  "posts.read",
  "posts.create",
  "posts.write",
  "posts.delete",
  "posts.publish",
  "users.read",
  "users.create",
  "users.write",
  "users.delete",
  "users.view",
  "billing.view",
  "billing.manage",
  "billing.invoices",
  "settings.read",
  "settings.manage",
  "settings.admin",
  "teams.read",
  "teams.create",
  "teams.manage",
  "analytics.view",
  "analytics.export",
  "logs.read",
  "logs.export",
  "admin.access",
  "admin.users",
  "admin.settings",
];
