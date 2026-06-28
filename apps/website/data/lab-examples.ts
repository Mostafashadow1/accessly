import type { BackendPreset, ReplayStep, Recipe } from "@/types/lab";

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

/* ── Recipes ── */

export const RECIPES: Recipe[] = [
  {
    id: "normalize-laravel",
    title: "Normalize Laravel Payload",
    problem: "Your Laravel backend returns all_permissions, but Accessly needs a flat permissions array.",
    icon: "🐘",
    color: "#ef4444",
    backendId: "laravel",
    permission: "repositories.write",
    explanation:
      "The Laravel adapter maps `src.all_permissions` to `permissions`, preserving the user context. No complex transformation needed — just point to the right key.",
  },
  {
    id: "normalize-nestjs",
    title: "Normalize NestJS Payload",
    problem: "NestJS returns abilities inside the user object. You need to extract them.",
    icon: "🟢",
    color: "#10b981",
    backendId: "nestjs",
    permission: "posts.create",
    explanation:
      "The NestJS adapter reaches into `src.user.abilities` for permissions and `src.user.roles` for roles. The adapter pattern keeps your components clean.",
  },
  {
    id: "sidebar-filter",
    title: "Filter Sidebar Navigation",
    problem: "Show or hide sidebar links based on user permissions.",
    icon: "📂",
    color: "#3b82f6",
    backendId: "express",
    permission: "repositories.write",
    explanation:
      "Use `Can permission=\"repositories.write\"` to conditionally render nav items. When the permission is missing, the element simply doesn't render.",
  },
  {
    id: "protect-route",
    title: "Protect a Route",
    problem: "Redirect users who lack a required permission.",
    icon: "🛡️",
    color: "#8b5cf6",
    backendId: "aspnet",
    permission: "repositories.write",
    explanation:
      "Use `useAccessDecision` to check permissions before rendering a route. If denied, show an unauthorized state or redirect.",
  },
  {
    id: "feature-flag",
    title: "Feature Flag UI",
    problem: "Gate beta features behind permissions.",
    icon: "🚩",
    color: "#f59e0b",
    backendId: "supabase",
    permission: "billing.view",
    explanation:
      "Treat permissions as feature flags. `Can permission=\"billing.view\"` conditionally renders billing UI. No separate flags system needed.",
  },
  {
    id: "debug-denied",
    title: "Debug a Denied Action",
    problem: "A permission check returned denied and you don't know why.",
    icon: "🔍",
    color: "#ef4444",
    backendId: "laravel",
    permission: "users.delete",
    explanation:
      "Accessly's decision replay shows exactly what was checked. If denied, inspect the AccessModel to see which permissions are actually available.",
  },
  {
    id: "role-expansion",
    title: "RBAC Role Expansion",
    problem: "Map backend roles (like 'admin') into a set of permissions.",
    icon: "🔄",
    color: "#22c55e",
    backendId: "springboot",
    permission: "repositories.write",
    explanation:
      "Spring Boot uses ROLE_ prefix. The adapter strips the prefix and lowercases roles, so your React code can check roles directly.",
  },
  {
    id: "explain-decision",
    title: "Explain a Decision to Users",
    problem: "Show users why an action was denied in plain language.",
    icon: "💬",
    color: "#10b981",
    backendId: "nestjs",
    permission: "posts.delete",
    explanation:
      "Accessly returns a structured decision object. Use it to render user-facing messages: 'You need the posts.delete permission to delete this post.'",
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
