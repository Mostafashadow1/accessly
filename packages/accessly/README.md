<p align="center">
  <img
    src="https://raw.githubusercontent.com/Mostafashadow1/accessly/main/packages/accessly/assets/accessly-readme.webp"
    alt="Accessly - Explainable access control for React"
    width="100%"
  />
</p>

# Accessly

Explainable access control for React and Next.js.

<p>
  <a href="https://www.npmjs.com/package/accessly"><img alt="npm version" src="https://img.shields.io/npm/v/accessly?color=7c5cff" /></a>
  <a href="https://bundlephobia.com/package/accessly"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/accessly?label=minzip&color=22c55e" /></a>
  <a href="https://www.npmjs.com/package/accessly"><img alt="dependencies" src="https://img.shields.io/badge/runtime%20deps-0-22c55e" /></a>
  <a href="https://github.com/Mostafashadow1/accessly/blob/main/packages/accessly/package.json"><img alt="tree shaking" src="https://img.shields.io/badge/tree--shaking-friendly-7c5cff" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6" /></a>
  <a href="https://github.com/Mostafashadow1/accessly/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-8b95b7" /></a>
</p>

<p>
  <a href="https://accessly-website.vercel.app/">Website</a>
  ·
  <a href="https://accessly-website.vercel.app/docs">Docs</a>
  ·
  <a href="https://accessly-website.vercel.app/lab">Accessly Lab</a>
  ·
  <a href="https://www.npmjs.com/package/accessly">npm</a>
  ·
  <a href="https://bundlephobia.com/package/accessly">Bundle size</a>
</p>

Accessly is a small permission layer for React applications. It helps you render UI from a normalized access model, check permissions and feature flags, filter navigation, adapt backend responses, and inspect exactly why a decision was allowed or denied.

It is designed for product teams that need frontend access logic to be consistent, debuggable, and easy to integrate with real backends.

## Highlights

- **Explainable decisions**: every check returns an `AccessDecision` with `allowed`, `reason`, `requested`, `matched`, `missing`, and `checkedFrom`.
- **React-first API**: use components like `Can`, `Cannot`, and `ProtectedRoute`, or hooks like `usePermission` and `useAccessDecision`.
- **RBAC support**: expand user roles into permissions with `rolePermissions`.
- **Wildcard permissions**: match permissions such as `users.*`, `reports.*`, or global `*`.
- **Feature flags**: check feature availability with the same provider and decision model.
- **Backend adapters**: normalize any backend shape into Accessly's `AccessModel`.
- **Built-in adapters**: flat permissions, grouped actions, pages-only access, nested modules, and feature flags.
- **Navigation filtering**: remove inaccessible links and nested menu items from your app navigation.
- **Debug utilities**: format decisions and inspect the active access model.
- **TypeScript-first**: ships generated `.d.ts` and `.d.cts` declarations.
- **Zero runtime dependencies**: Accessly has no regular runtime dependencies. React is a peer dependency.
- **Tree-shaking friendly**: ships ESM, CJS, package exports, and `"sideEffects": false`.

## Installation

```bash
npm install accessly
```

Other package managers:

```bash
pnpm add accessly
yarn add accessly
bun add accessly
```

Accessly expects React to be installed in your app:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

## Quick Start

Wrap your app with `PermissionProvider`, then render gated UI with `Can`.

```tsx
import { PermissionProvider, Can } from "accessly";

export function App() {
  return (
    <PermissionProvider
      access={{
        user: { id: "user_1", roles: ["admin"] },
        permissions: ["users.create", "users.view"],
        flags: ["features.new-dashboard"],
      }}
    >
      <Can permission="users.create" fallback={<span>Read only</span>}>
        <button>Create user</button>
      </Can>
    </PermissionProvider>
  );
}
```

## The Access Model

Accessly reads one normalized shape: `AccessModel`.

Your backend can look however it wants. Accessly only needs the data normalized into this model.

```ts
type AccessModel = {
  user?: {
    id?: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
  };
  permissions?: string[];
  flags?: string[];
  navigation?: NavigationItem[];
  isLoading?: boolean;
};

type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;
  children?: NavigationItem[];
};
```

### Why normalize?

Most teams do not have identical authorization APIs:

- Some APIs return `permissions: ["users.create"]`.
- Some return grouped actions like `{ users: ["create", "delete"] }`.
- Some return roles only.
- Some return flags from a separate service.
- Some return page access instead of action permissions.

Accessly gives your UI one consistent model, while adapters keep backend-specific mapping at the edge.

## PermissionProvider

`PermissionProvider` makes an access model available to Accessly components and hooks.

```tsx
import { PermissionProvider } from "accessly";

export function Root() {
  return (
    <PermissionProvider
      access={{
        user: { id: "user_1", roles: ["manager"] },
        permissions: ["reports.view", "reports.export"],
        flags: ["features.audit-log"],
      }}
    >
      <App />
    </PermissionProvider>
  );
}
```

### Provider props

```ts
type PermissionProviderProps = {
  children: React.ReactNode;
  access?: AccessModel | null;
  source?: unknown;
  adapter?: AccessAdapter<unknown>;
  rolePermissions?: RolePermissions;
  registry?: readonly string[];
  unknownPermission?: "ignore" | "warn" | "throw";
  loading?: boolean;
};
```

Use `access` when you already have an `AccessModel`.

Use `source` + `adapter` when your backend returns a custom shape.

## Components

### Can

Render children only when a permission check is allowed.

```tsx
import { Can } from "accessly";

<Can permission="documents.create" fallback={<span>Read only</span>}>
  <button>New document</button>
</Can>;
```

### Cannot

Render children when a permission check is denied.

```tsx
import { Cannot } from "accessly";

<Cannot permission="billing.manage">
  <p>Billing settings are restricted for your account.</p>
</Cannot>;
```

### ProtectedRoute

Gate a route, page section, or larger UI boundary.

```tsx
import { ProtectedRoute } from "accessly";

<ProtectedRoute
  permission="admin.view"
  fallback={<p>You do not have access to this page.</p>}
  loading={<p>Checking access...</p>}
>
  <AdminPage />
</ProtectedRoute>;
```

### Render-prop access

`Can`, `Cannot`, and `ProtectedRoute` can receive a function child when you want full access to the decision.

```tsx
<Can permission="reports.export">
  {(decision) =>
    decision.allowed ? (
      <button>Export</button>
    ) : (
      <span>Missing: {decision.missing?.join(", ")}</span>
    )
  }
</Can>
```

## Hooks

### usePermission

Returns a boolean.

```tsx
import { usePermission } from "accessly";

export function ExportButton() {
  const canExport = usePermission("reports.export");

  if (!canExport) return null;

  return <button>Export report</button>;
}
```

### useAccessDecision

Returns the full decision object.

```tsx
import { useAccessDecision } from "accessly";

export function DeleteUserButton() {
  const decision = useAccessDecision("users.delete");

  if (!decision.allowed) {
    return <span>Denied: {decision.reason}</span>;
  }

  return <button>Delete user</button>;
}
```

### useAccessModel

Reads the current normalized model.

```tsx
import { useAccessModel } from "accessly";

export function AccountBadge() {
  const model = useAccessModel();

  return <span>{model?.user?.id ?? "anonymous"}</span>;
}
```

## Permission Checks

Accessly supports four check inputs.

### Single permission

```tsx
<Can permission="users.create">
  <button>Create user</button>
</Can>
```

Equivalent object form:

```tsx
<Can permission={{ permission: "users.create" }}>
  <button>Create user</button>
</Can>
```

### Any permission

Allowed when at least one requested permission matches.

```tsx
<Can permission={{ any: ["users.create", "users.invite"] }}>
  <button>Add teammate</button>
</Can>
```

### All permissions

Allowed only when every requested permission matches.

```tsx
<Can permission={{ all: ["reports.view", "reports.export"] }}>
  <button>Export report</button>
</Can>
```

### Feature flag

Allowed when the requested flag exists in `model.flags`.

```tsx
<Can permission={{ flag: "features.new-dashboard" }}>
  <NewDashboard />
</Can>
```

## Explainable Decisions

The core difference between Accessly and a plain boolean helper is that Accessly can tell you why a check passed or failed.

```tsx
import { useAccessDecision } from "accessly";

export function DecisionPreview() {
  const decision = useAccessDecision("reports.export");

  return <pre>{JSON.stringify(decision, null, 2)}</pre>;
}
```

Example allowed decision:

```json
{
  "allowed": true,
  "reason": "allowed",
  "requested": ["reports.export"],
  "matched": ["reports.*"],
  "checkedFrom": "wildcard"
}
```

Example denied decision:

```json
{
  "allowed": false,
  "reason": "missing_permission",
  "requested": ["billing.manage"],
  "missing": ["billing.manage"],
  "checkedFrom": "none"
}
```

Decision type:

```ts
type AccessDecision = {
  allowed: boolean;
  reason:
    | "allowed"
    | "missing_permission"
    | "missing_flag"
    | "unknown_permission"
    | "not_ready"
    | "invalid_request";
  requested?: string[];
  missing?: string[];
  matched?: string[];
  checkedFrom?: "direct" | "role" | "wildcard" | "flag" | "none";
};
```

## RBAC

Accessly can expand user roles into permissions with `rolePermissions`.

```tsx
import { PermissionProvider, Can } from "accessly";

const rolePermissions = {
  admin: ["users.*", "billing.manage", "reports.export"],
  support: ["users.view", "tickets.*"],
};

export function App() {
  return (
    <PermissionProvider
      access={{
        user: { id: "user_1", roles: ["support"] },
        permissions: ["dashboard.view"],
      }}
      rolePermissions={rolePermissions}
    >
      <Can permission="tickets.close">
        <button>Close ticket</button>
      </Can>
    </PermissionProvider>
  );
}
```

If a permission is granted through role expansion, `checkedFrom` is `"role"`.

## Wildcard Permissions

Accessly supports segment-based wildcard matching.

```ts
matchPermission("users.*", "users.create"); // true
matchPermission("users.*", "users.delete"); // true
matchPermission("users.*", "users.profile.edit"); // false
matchPermission("*", "anything.here"); // true
```

Rules:

- `*` matches everything.
- `users.*` matches one segment after `users`.
- `users.profile.*` matches `users.profile.edit`.
- Wildcards are segment-based; Accessly does not support globstar patterns like `users.**`.

## Backend Adapters

Use `createAdapter` when your backend shape is custom.

```tsx
import { PermissionProvider, createAdapter } from "accessly";

type BackendUser = {
  id: string;
  roles: string[];
  perms: string[];
  featureFlags: string[];
};

const backendAdapter = createAdapter((source: BackendUser) => ({
  user: {
    id: source.id,
    roles: source.roles,
  },
  permissions: source.perms,
  flags: source.featureFlags,
}));

export function App({ user }: { user: BackendUser }) {
  return (
    <PermissionProvider source={user} adapter={backendAdapter}>
      <Product />
    </PermissionProvider>
  );
}
```

Adapter type:

```ts
type AccessAdapter<TSource = unknown> = {
  normalize: (source: TSource) => AccessModel;
};
```

## Built-in Adapters

### directPermissionsAdapter

For APIs that already return permissions, roles, and flags.

```ts
import { directPermissionsAdapter } from "accessly";

const model = directPermissionsAdapter({
  roles: ["admin"],
  permissions: ["users.create"],
  flags: ["features.audit-log"],
});
```

### createActionsAdapter

For APIs that group allowed actions by resource.

```ts
import { createActionsAdapter } from "accessly";

const model = createActionsAdapter({
  users: ["create", "delete"],
  reports: ["view"],
});

// permissions: ["users.create", "users.delete", "reports.view"]
```

### pagesOnlyAdapter

For APIs that only return page or route access.

```ts
import { pagesOnlyAdapter } from "accessly";

const model = pagesOnlyAdapter({
  pages: ["dashboard", "settings"],
});

// permissions: ["pages.dashboard", "pages.settings"]
```

### nestedModulesAdapter

For nested module/action maps.

```ts
import { nestedModulesAdapter } from "accessly";

const model = nestedModulesAdapter({
  users: {
    create: true,
    delete: false,
  },
  reports: {
    export: true,
  },
});

// permissions: ["users.create", "reports.export"]
```

### featureFlagsAdapter

For feature flag APIs that return boolean maps.

```ts
import { featureFlagsAdapter } from "accessly";

const model = featureFlagsAdapter({
  features: {
    "new-dashboard": true,
    "legacy-admin": false,
  },
});

// flags: ["features.new-dashboard"]
```

## Navigation Filtering

Accessly can filter navigation arrays using the same permission engine.

```tsx
import {
  filterNavigation,
  type AccessModel,
  type NavigationItem,
} from "accessly";

const items: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard.view" },
  { label: "Users", href: "/users", permission: "users.view" },
  { label: "Billing", href: "/billing", permission: "billing.view" },
];

export function visibleNavigation(access: AccessModel) {
  return filterNavigation(items, access);
}
```

Nested navigation is supported:

```ts
const items: NavigationItem[] = [
  {
    label: "Admin",
    permission: "admin.view",
    children: [
      { label: "Users", href: "/admin/users", permission: "users.view" },
      { label: "Billing", href: "/admin/billing", permission: "billing.view" },
    ],
  },
];
```

If all children are filtered out, the parent item is removed too.

Hook form:

```tsx
import { useFilteredNavigation } from "accessly";

const visibleItems = useFilteredNavigation(items, accessModel);
```

## Unknown Permission Handling

Use `registry` with `unknownPermission` when you want to catch checks for permissions your app does not recognize.

```tsx
<PermissionProvider
  access={{ permissions: ["users.view"] }}
  registry={["users.view", "users.create", "billing.manage"]}
  unknownPermission="throw"
>
  <App />
</PermissionProvider>
```

Strategies:

- `"ignore"`: denied unknown permissions behave like normal missing permissions.
- `"warn"`: keeps the normal missing-permission decision shape, which is useful when your app wants to layer warning behavior around denied unknown checks.
- `"throw"`: returns a decision with `reason: "unknown_permission"`.

## Debug Utilities

### formatDecision

Turn a decision into a readable string.

```ts
import { formatDecision, checkPermission } from "accessly";

const decision = checkPermission(
  { permissions: ["reports.*"] },
  { permission: "reports.export" },
);

console.log(formatDecision(decision));
```

Output:

```text
Allowed: true
Reason: allowed
Requested: reports.export
Matched: reports.*
Checked from: wildcard
```

### inspectAccess

Print the active access model.

```ts
import { inspectAccess } from "accessly";

console.log(
  inspectAccess({
    user: { id: "user_1", roles: ["admin"] },
    permissions: ["users.*"],
    flags: ["features.audit-log"],
  }),
);
```

## Core Engine API

You can use Accessly without React components when you need a direct decision.

```ts
import { checkPermission } from "accessly";

const decision = checkPermission(
  {
    user: { roles: ["admin"] },
    permissions: ["dashboard.view"],
  },
  { permission: "dashboard.view" },
);

if (decision.allowed) {
  // Render, redirect, or continue.
}
```

## Package Design

Accessly is built to stay small and predictable.

- **No regular dependencies**: `package.json` has no `dependencies`.
- **React as a peer dependency**: your application controls the React version.
- **ESM and CJS builds**: `module`, `main`, and `exports` are provided.
- **Type declarations**: ships `dist/index.d.ts` and `dist/index.d.cts`.
- **Tree-shaking friendly**: `"sideEffects": false` and ESM output help modern bundlers remove unused exports.
- **Framework friendly**: works in React and Next.js client components. The package itself does not require Next.js.

Useful package links:

- Bundle size: [bundlephobia.com/package/accessly](https://bundlephobia.com/package/accessly)
- npm package: [npmjs.com/package/accessly](https://www.npmjs.com/package/accessly)
- Website: [accessly-website.vercel.app](https://accessly-website.vercel.app/)

## Complete Public API

```ts
// Types
export type {
  AccessModel,
  NavigationItem,
  AccessDecision,
  RolePermissions,
  PermissionCheckInput,
  AccessAdapter,
} from "accessly";

// Engine
export { checkPermission, matchPermission } from "accessly";

// Adapters
export {
  createAdapter,
  directPermissionsAdapter,
  createActionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featureFlagsAdapter,
} from "accessly";

// Provider
export { PermissionProvider } from "accessly";
export type { PermissionProviderProps } from "accessly";

// Hooks
export { usePermission, useAccessDecision, useAccessModel } from "accessly";

// Components
export { Can, Cannot, ProtectedRoute } from "accessly";

// Navigation
export { filterNavigation, useFilteredNavigation } from "accessly";

// Debug
export { formatDecision, inspectAccess } from "accessly";
```

## Security Note

Accessly controls frontend rendering. It helps you hide, show, explain, and organize UI based on access data.

It does **not** replace server-side authorization. Sensitive actions, data fetching, mutations, billing operations, admin actions, and private API routes must still be authorized on the server.

## Known V1 Limitations

- Wildcard matching is segment-based and does not support deep globstar patterns like `users.**`.
- Feature flag checks are exact-match only.
- Navigation items support one `permission` string per item.
- `user.attributes` is available on the model, but Accessly does not currently evaluate attribute expressions for you.
- Adapter output is trusted. Validate backend data before returning an `AccessModel` in production.

## License

MIT
