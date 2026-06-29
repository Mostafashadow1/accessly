# Accessly Explained

This document is a maintainer learning guide for Accessly. Its purpose is to make every public API and concept easy to explain to React and TypeScript developers.

Accessly is a frontend access-control helper. It helps an app answer questions like:

- Should this button render?
- Should this route show a fallback?
- Which navigation items should be visible?
- Which feature flags are enabled for the current user?
- Why was a permission allowed or denied?

Accessly does not secure backend data. It improves frontend consistency, user experience, and debugging. Backend APIs must still enforce authorization for every sensitive operation.

## 1. Big Picture

### What Problem Accessly Solves

Most React apps eventually need permission checks in many places:

```tsx
if (user.role === "admin") return <DeleteButton />;
if (permissions.includes("users.create")) return <CreateUserButton />;
if (plan === "pro") return <ExportButton />;
```

This works at first, but it becomes hard to maintain when checks spread across route files, buttons, menus, table actions, settings pages, and feature experiments.

Accessly gives the app one normalized access model and a small set of APIs for checking it. The goal is not to invent a new authorization system. The goal is to make frontend access checks consistent and explainable.

### Why Scattered Role Checks Are Harmful

Scattered checks create several problems:

- Different parts of the UI can interpret the same role differently.
- Developers have to remember permission names and role meanings manually.
- Debugging becomes slow because a hidden button has no clear explanation.
- Changing a permission rule requires searching across the whole app.
- Role checks often mix business policy with rendering logic.

Accessly encourages developers to check capabilities such as `users.create` instead of hard-coding assumptions like `user.role === "admin"` everywhere.

### Why Frontend Access Control Is Useful

Frontend access control improves the experience around permissions. It can:

- Hide controls that a user cannot use.
- Show helpful fallback messages.
- Prevent dead-end navigation.
- Keep menus and route sections aligned with the current user's access.
- Help developers inspect why a UI element was shown or hidden.

It also keeps frontend code readable. A component can ask `Can this user export reports?` without knowing how the backend stores roles, flags, or page access.

### Why It Does Not Replace Backend Authorization

Frontend checks are visible to the browser and can be bypassed. A user can edit JavaScript, call APIs directly, or change local state. For that reason:

- Accessly should not be trusted as a security boundary.
- Backend endpoints must check permissions before returning or mutating sensitive data.
- Accessly should mirror backend decisions for UI behavior, not replace them.

The best explanation is: backend authorization protects the system; Accessly makes the frontend reflect that authorization clearly.

### What "Explainable Access Control" Means

Many permission helpers return only `true` or `false`. Accessly can return an `AccessDecision`:

```ts
{
  allowed: false,
  reason: "missing_permission",
  requested: ["users.delete"],
  missing: ["users.delete"],
  checkedFrom: "none"
}
```

That explanation helps answer:

- What was requested?
- Was it a permission or a feature flag?
- Which permission matched?
- Which permission was missing?
- Was the match direct, role-based, wildcard-based, or flag-based?
- Was the access model still loading?

This is useful for debugging, support, docs, demos, and maintainer conversations.

## 2. Access Model

### What `AccessModel` Is

`AccessModel` is the normalized shape Accessly reads:

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
```

It represents the current frontend session's access data in a predictable format.

### Why It Contains `user`

The `user` field gives context for the current authenticated user:

- `id` can identify the current user for display or debugging.
- `roles` can be expanded into permissions with `rolePermissions`.
- `attributes` gives apps a place for user-related metadata.

Accessly does not currently evaluate `attributes` in the core engine. They are part of the model so apps can keep relevant session context together and build their own wrappers if needed.

### Why It Contains `permissions`

`permissions` is the main list of capabilities available to the current user:

```ts
permissions: ["users.view", "users.create", "reports.export"]
```

These strings are what `Can`, `usePermission`, `useAccessDecision`, `checkPermission`, and `filterNavigation` compare against.

### Why It Contains `flags`

`flags` represent feature availability:

```ts
flags: ["features.new-dashboard", "features.audit-log"]
```

Flags answer a different question from permissions. Permissions usually mean "the user is allowed to perform this action." Flags usually mean "this feature is enabled for this user, tenant, plan, rollout, or environment."

### How It Represents the Current Authenticated User Only

An `AccessModel` should describe the current user/session, not every user in the system. For example, a dashboard for the signed-in user might receive:

```ts
{
  user: { id: "user_123", roles: ["manager"] },
  permissions: ["users.view", "reports.export"],
  flags: ["features.new-dashboard"]
}
```

Accessly then answers UI questions for that one session.

### What Happens If 100 Users Have the Same Permissions

You still pass only the current user's access data. If 100 users share the same permissions, each user's frontend session receives its own equivalent `AccessModel`.

Accessly is not a user directory. It does not need a list of all 100 users. It only needs the permissions, flags, and roles for the user currently using the app.

### Why the Frontend Should Not Receive All Users

Sending all users and their permissions to the frontend is usually unnecessary and risky:

- It exposes information the current user may not need.
- It increases payload size.
- It creates privacy and security concerns.
- It makes the UI responsible for filtering data that the backend should already protect.

The frontend should receive only the access data needed to render the current session.

### How AccessModel Usually Comes From Backend/Login/Session APIs

Common sources include:

- Login response.
- Session endpoint such as `/api/session`.
- Current-user endpoint such as `/api/me`.
- Tenant bootstrap endpoint.
- Backend-for-frontend response.

The backend can return any shape. Accessly only needs it normalized into `AccessModel`, either manually or with an adapter.

## 3. PermissionProvider

### Why It Exists

`PermissionProvider` puts the current access data into React Context so Accessly hooks and components can read it anywhere below the provider.

Without a provider, every component would need props like `permissions`, `flags`, `roles`, `registry`, and `rolePermissions`. That becomes noisy and error-prone.

### What Data It Stores

The provider stores:

- The normalized `AccessModel`.
- Optional `rolePermissions`.
- Optional permission `registry`.
- Optional `unknownPermission` strategy.
- A `loading` state.

Provider props:

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

### How React Context Is Used

The provider creates a context value. Hooks such as `usePermission`, `useAccessDecision`, and `useAccessModel` read that context. Components such as `Can`, `Cannot`, and `ProtectedRoute` use those hooks.

If a hook is used outside the provider, Accessly throws:

```txt
Accessly: usePermission hooks must be used inside <PermissionProvider>.
```

### Why You Do Not Pass Permissions to Every Component Manually

React Context fits access data because many UI components need it, but the data is session-level rather than owned by each component. The provider makes access checks feel local:

```tsx
<Can permission="users.create">
  <button>Create user</button>
</Can>
```

The button does not need to know where the access model came from.

### When Access Changes

Access can change when:

- Login completes.
- Logout happens.
- The user switches tenant or workspace.
- The session refreshes.
- Roles or plan change.
- Feature flags are reloaded.

When `access`, `source`, `adapter`, `rolePermissions`, `registry`, `unknownPermission`, or `loading` change, provider consumers can recompute decisions.

### Loading Behavior

`PermissionProvider` accepts `loading`. When `loading` is true, hooks use an internal loading model. Decisions return:

```ts
{
  allowed: false,
  reason: "not_ready"
}
```

Components then render their `loading` prop when provided, otherwise `fallback`, otherwise `null`.

### Common Mistakes

- Using hooks outside `PermissionProvider`.
- Passing every user in the system instead of the current user's access.
- Treating frontend checks as backend security.
- Creating a new `access` object on every render when the data has not changed.
- Passing `source` without `adapter`.
- Passing both `access` and `source` and expecting a merge. Current behavior prefers `access` when provided.

## 4. Core Engine

### `checkPermission`

`checkPermission` is the pure core decision function:

```ts
checkPermission(model, { permission: "users.create" });
checkPermission(model, { any: ["users.create", "users.invite"] });
checkPermission(model, { all: ["users.view", "users.export"] });
checkPermission(model, { flag: "features.new-dashboard" });
```

It returns an `AccessDecision`, not just a boolean.

Use it when:

- You are outside React.
- You are writing tests.
- You are building a custom store wrapper.
- You need an explainable decision in utility code.
- You want the engine without components or hooks.

### `matchPermission`

`matchPermission(permission, target)` checks whether one permission pattern matches one requested permission.

Examples:

```ts
matchPermission("users.create", "users.create"); // true
matchPermission("users.*", "users.delete"); // true
matchPermission("users.*", "users.profile.edit"); // false
matchPermission("*", "anything.here"); // true
```

Most users do not need to call it directly. It is exported for advanced usage, tests, custom tooling, or explaining wildcard behavior.

### `any` Checks

`any` allows access if at least one requested permission matches:

```ts
checkPermission(model, {
  any: ["users.create", "users.invite"],
});
```

This is useful when multiple capabilities can unlock the same UI.

If nothing matches, the decision is denied and `missing` contains all requested permissions.

### `all` Checks

`all` allows access only if every requested permission matches:

```ts
checkPermission(model, {
  all: ["reports.view", "reports.export"],
});
```

This is useful for workflows that require multiple capabilities.

If some permissions match and some are missing, `matched` contains the matched permissions and `missing` contains the missing ones.

### Feature Flag Checks

Feature flags are checked with:

```ts
checkPermission(model, {
  flag: "features.new-dashboard",
});
```

Flags are matched by exact inclusion in `model.flags`. A successful flag check has `checkedFrom: "flag"`.

### Unknown Permission Strategy

`checkPermission` accepts:

```ts
{
  registry?: readonly string[];
  unknownPermission?: "ignore" | "warn" | "throw";
}
```

The registry is a known list of valid permission names. A missing permission can be either:

- Known but not granted to the user.
- Unknown because the app checked a permission not in the registry.

Strategies:

- `ignore`: denied checks return `missing_permission`.
- `warn`: the core engine still returns `missing_permission`; the debug wrapper can log warnings.
- `throw`: denied checks for unknown permissions return `unknown_permission`.

Important behavior: without a registry, the engine conservatively treats every missing permission as unknown when `unknownPermission` is `"throw"`.

### `AccessDecision` Shape

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

### Allowed and Denied Reasons

`allowed` is the boolean answer.

`reason` explains why:

- `allowed`: the permission or flag matched.
- `missing_permission`: one or more permissions were not present.
- `missing_flag`: a feature flag was not present.
- `unknown_permission`: the check requested a permission outside the registry and strategy was `"throw"`.
- `not_ready`: no model exists yet, or the model is loading.
- `invalid_request`: the input did not contain `permission`, `any`, `all`, or `flag`.

### `checkedFrom`

`checkedFrom` explains where the match came from:

- `direct`: matched a permission in `model.permissions`.
- `role`: matched a permission expanded from `rolePermissions`.
- `wildcard`: matched a wildcard permission in `model.permissions`.
- `flag`: matched `model.flags`.
- `none`: nothing matched.

Current nuance: role-based wildcard matches are reported as `role`, because the origin is role expansion.

### Matched Permission

`matched` contains the permission or flag string that allowed the decision:

```ts
{
  allowed: true,
  requested: ["users.delete"],
  matched: ["users.*"],
  checkedFrom: "wildcard"
}
```

This is especially useful when a wildcard or role permission unlocks a specific target.

### Missing Permission

`missing` contains requested permissions or flags that were not found:

```ts
{
  allowed: false,
  reason: "missing_permission",
  requested: ["users.edit"],
  missing: ["users.edit"],
  checkedFrom: "none"
}
```

### When to Use the Core Engine Without React

Use `checkPermission` directly in:

- Node scripts.
- Unit tests.
- CLI tools.
- Shared non-React packages.
- Store selectors.
- Server-rendering helpers where you already have access data.

Example:

```ts
import { checkPermission } from "accessly";

const decision = checkPermission(session.access, {
  permission: "reports.export",
});

if (!decision.allowed) {
  console.log(decision.reason);
}
```

### Why `checkPermission` Requires Access Data Every Time

`checkPermission` is intentionally stateless. It receives all needed data and returns a decision. This makes it:

- Easy to test.
- Safe to use outside React.
- Free of hidden global state.
- Predictable in concurrent rendering or multiple-session contexts.

### How to Wrap It With a Store/Helper If Needed

Apps that use Zustand, Redux, Jotai, or another store can wrap it:

```ts
function can(permission: string) {
  const model = accessStore.getState().access;
  return checkPermission(model, { permission }).allowed;
}

function explain(permission: string) {
  const model = accessStore.getState().access;
  return checkPermission(model, { permission });
}
```

The wrapper owns the state lookup. Accessly remains pure.

## 5. React Components

All three components accept a `permission` prop. It can be either a string or a full `PermissionCheckInput`:

```tsx
<Can permission="users.create" />
<Can permission={{ any: ["users.create", "users.invite"] }} />
<Can permission={{ all: ["reports.view", "reports.export"] }} />
<Can permission={{ flag: "features.new-dashboard" }} />
```

All three support render-prop children. When `children` is a function, Accessly gives the function the full decision and lets the function control rendering.

### `Can`

`Can` renders children when the decision is allowed.

Why it exists: use it for small declarative UI gates such as buttons, actions, fields, tabs, or panels.

Example:

```tsx
<Can permission="users.create" fallback={<span>Read only</span>}>
  <button>Create user</button>
</Can>
```

Fallback behavior:

- Allowed: renders `children`.
- Denied: renders `fallback` if provided, otherwise `null`.
- Loading/not ready: renders `loading` if provided, otherwise `fallback`, otherwise `null`.

Render-prop behavior:

```tsx
<Can permission="reports.export">
  {(decision) =>
    decision.allowed ? (
      <button>Export</button>
    ) : (
      <span>Denied: {decision.reason}</span>
    )
  }
</Can>
```

When children is a function, it is called even during loading, allowed, and denied states.

Common questions:

- Use `Can` when the positive/access-allowed branch is the main UI.
- Use `fallback` for a disabled message, upgrade prompt, or replacement UI.
- Use render props when the UI needs the reason or missing permission.

Common mistakes:

- Hiding a destructive button with `Can` and forgetting that the backend still needs authorization.
- Using many nested `Can` components when one `all` check would be clearer.
- Using `Can` for whole routes when `ProtectedRoute` communicates intent better.

### `Cannot`

`Cannot` renders children when the decision is denied.

Why it exists: use it for denial messages, upgrade prompts, setup prompts, or warnings.

Example:

```tsx
<Cannot permission="billing.manage">
  <p>Billing settings are restricted for this account.</p>
</Cannot>
```

Fallback behavior:

- Denied: renders `children`.
- Allowed: renders `fallback` if provided, otherwise `null`.
- Loading/not ready: renders `loading` if provided, otherwise `fallback`, otherwise `null`.

Render-prop behavior:

```tsx
<Cannot permission={{ flag: "features.audit-log" }}>
  {(decision) =>
    decision.allowed ? null : <span>Audit log unavailable: {decision.reason}</span>
  }
</Cannot>
```

Common questions:

- `Cannot` is the inverse rendering helper, but the underlying decision is the same.
- It is useful when the denial UI is the main thing being rendered.

Common mistakes:

- Assuming denied always means missing permission. It may also mean missing flag, not ready, unknown permission, or invalid request.
- Showing denial messages during loading. Provide a `loading` prop when that would confuse users.

### `ProtectedRoute`

`ProtectedRoute` renders children when allowed and fallback when denied.

Why it exists: use it for route-level or large section-level boundaries. It has no router dependency, so it works with React Router, Next.js, TanStack Router, or custom routing.

Example:

```tsx
<ProtectedRoute
  permission="pages.admin"
  loading={<p>Checking access...</p>}
  fallback={<p>You do not have access to this page.</p>}
>
  <AdminPage />
</ProtectedRoute>
```

Fallback behavior:

- Allowed: renders `children`.
- Denied: renders `fallback` if provided, otherwise `null`.
- Loading/not ready: renders `loading` if provided, otherwise `fallback`, otherwise `null`.

Render-prop behavior:

```tsx
<ProtectedRoute permission="pages.reports">
  {(decision) =>
    decision.allowed ? <ReportsPage /> : <Forbidden reason={decision.reason} />
  }
</ProtectedRoute>
```

Common questions:

- `ProtectedRoute` is similar to `Can`, but it communicates route/page intent.
- It does not redirect by itself. Provide a fallback that redirects or renders a router-specific component if needed.

Common mistakes:

- Expecting `ProtectedRoute` to integrate with a router automatically.
- Using it as the only protection for sensitive backend data.

## 6. Hooks

### `usePermission`

`usePermission(input)` returns a boolean.

Where it gets data from: it reads the provider context, then calls `checkPermission`.

Example:

```tsx
function ExportButton() {
  const canExport = usePermission("reports.export");

  if (!canExport) return null;

  return <button>Export</button>;
}
```

Use it when:

- You only need true or false.
- You are branching in component logic.
- You do not need to show debug details.

Common questions:

- It accepts the same string or object input as `Can`.
- During loading, it returns `false` because the decision is not ready.

### `useAccessDecision`

`useAccessDecision(input)` returns the full `AccessDecision`.

Where it gets data from: it reads the provider context, applies loading behavior, and calls `checkPermission` with provider options.

Example:

```tsx
function DeleteUserButton() {
  const decision = useAccessDecision("users.delete");

  if (!decision.allowed) {
    return <span>Denied: {decision.reason}</span>;
  }

  return <button>Delete user</button>;
}
```

Use it when:

- You need `reason`, `missing`, `matched`, or `checkedFrom`.
- You are building a debug panel.
- You need to distinguish loading from denied.
- You want to explain an access decision to a user or developer.

Difference from `usePermission`: `usePermission` gives a boolean; `useAccessDecision` gives the explanation.

### `useAccessModel`

`useAccessModel()` returns the current `AccessModel | null`.

Where it gets data from: it reads the provider context and returns either the current model or a loading model when provider `loading` is true.

Example:

```tsx
function AccountBadge() {
  const model = useAccessModel();
  return <span>{model?.user?.id ?? "anonymous"}</span>;
}
```

Use it when:

- You need to display current user context.
- You are building debugging UI.
- You need direct access to permissions or flags.

Common question: should components mutate it? No. Treat it as read-only session data.

## 7. Backend Adapters

### Why Adapters Exist

Backends rarely agree on one permission shape. Some return flat permissions. Some return roles. Some return nested modules. Some return page names. Some return feature booleans.

Adapters keep that backend-specific shape at the edge of the app and normalize it into `AccessModel`.

### `createAdapter`

`createAdapter` wraps a custom normalize function:

```ts
const sessionAdapter = createAdapter((source: SessionResponse) => ({
  user: {
    id: source.user.id,
    roles: source.user.roles,
  },
  permissions: source.access.permissions,
  flags: source.features.enabled,
}));
```

Backend shape it solves: any custom shape.

Example backend response:

```ts
{
  user: { id: "user_123", roles: ["manager"] },
  access: { permissions: ["reports.view"] },
  features: { enabled: ["features.new-dashboard"] }
}
```

Example normalized model:

```ts
{
  user: { id: "user_123", roles: ["manager"] },
  permissions: ["reports.view"],
  flags: ["features.new-dashboard"]
}
```

When not to use it: if the backend already returns a valid `AccessModel`, pass `access` directly to `PermissionProvider`.

### `directPermissionsAdapter`

Normalizes a flat permission response:

```ts
directPermissionsAdapter({
  permissions: ["users.create", "users.delete"],
  roles: ["admin"],
  flags: ["features.beta"],
});
```

Backend shape it solves:

```ts
{
  permissions?: string[];
  roles?: string[];
  flags?: string[];
}
```

Normalized model:

```ts
{
  user: { roles: ["admin"] },
  permissions: ["users.create", "users.delete"],
  flags: ["features.beta"]
}
```

When not to use it: if your backend nests permissions under modules, actions, or feature objects.

### `createActionsAdapter`

Converts resource-action maps into dot permissions.

Example backend response:

```ts
{
  users: ["create", "delete"],
  posts: ["view"]
}
```

Normalized model:

```ts
{
  permissions: ["users.create", "users.delete", "posts.view"]
}
```

When not to use it: if actions are booleans rather than arrays, use `nestedModulesAdapter` or a custom adapter.

### `featureFlagsAdapter`

Converts enabled feature booleans into flags prefixed with `features.`.

Example backend response:

```ts
{
  features: {
    "new-dashboard": true,
    "beta-reports": false
  }
}
```

Normalized model:

```ts
{
  flags: ["features.new-dashboard"]
}
```

When not to use it: if your feature service already returns an array of flag names, or if flags need tenant/user merging that requires custom logic.

Important nuance: this adapter returns flags, not permissions.

### `nestedModulesAdapter`

Converts nested boolean modules into permissions.

Example backend response:

```ts
{
  users: {
    create: true,
    delete: false,
    view: true
  }
}
```

Normalized model:

```ts
{
  permissions: ["users.create", "users.view"]
}
```

When not to use it: if actions are arrays, use `createActionsAdapter`.

### `pagesOnlyAdapter`

Converts page names into `pages.*` permissions.

Example backend response:

```ts
{
  pages: ["dashboard", "users", "pages.settings"]
}
```

Normalized model:

```ts
{
  permissions: ["pages.dashboard", "pages.users", "pages.settings"]
}
```

It does not double-prefix values that already start with `pages.`.

When not to use it: if your app needs action-level checks such as `users.create` or `reports.export`.

## 8. Navigation

### `filterNavigation`

`filterNavigation(items, model)` returns a new list of navigation items visible to the current access model.

Navigation item type:

```ts
type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;
  children?: NavigationItem[];
};
```

Flat example:

```ts
const nav = [
  { label: "Dashboard", href: "/", permission: "pages.dashboard" },
  { label: "Settings", href: "/settings", permission: "pages.settings" },
];

filterNavigation(nav, {
  permissions: ["pages.dashboard"],
});
```

Result:

```ts
[
  { label: "Dashboard", href: "/", permission: "pages.dashboard" }
]
```

### Nested Navigation Example

```ts
const nav = [
  {
    label: "Users",
    href: "/users",
    permission: "pages.users",
    children: [
      { label: "Create", href: "/users/create", permission: "users.create" },
      { label: "List", href: "/users/list", permission: "users.list" },
    ],
  },
];

filterNavigation(nav, {
  permissions: ["pages.users", "users.create"],
});
```

Result keeps `Users` and only the permitted `Create` child.

Important behavior: if an item has children and all children are filtered out, the parent is removed too, even if the parent permission passed. This prevents empty menu groups.

### `useFilteredNavigation`

`useFilteredNavigation(items, model)` memoizes `filterNavigation` for React components:

```tsx
const filtered = useFilteredNavigation(navItems, accessModel);
```

### Why Navigation Filtering Matters

Navigation should guide users toward places they can actually use. Filtering reduces dead ends and makes the app feel coherent.

### Why Backend Authorization Is Still Required

Navigation filtering only hides links. Users can still type URLs manually or call APIs. Route components and backend endpoints still need access checks.

### Common Mistakes

- Treating hidden navigation as security.
- Forgetting to pass a model. `filterNavigation` returns `[]` for `null`.
- Expecting parent items with no visible children to stay visible.
- Using navigation permissions that do not match route-level permissions.

## 9. Wildcard Permissions

### Why Wildcard Permissions Exist

Wildcards reduce repetition when a user has a group of related capabilities.

Instead of:

```ts
["users.create", "users.delete", "users.view"]
```

an app can grant:

```ts
["users.*"]
```

### When They Are Useful

Use wildcards when:

- A role should receive every action at one resource level.
- A permission group is stable and easy to explain.
- You want role definitions to stay compact.

### When They Are Unnecessary

Avoid wildcards when:

- Only one or two permissions are needed.
- The wildcard would accidentally grant too much.
- The permission tree is unclear.
- Auditors or maintainers need explicit permission lists.

### `users.*`

`users.*` matches permissions with exactly two segments where the first segment is `users`:

```ts
matchPermission("users.*", "users.create"); // true
matchPermission("users.*", "users.delete"); // true
matchPermission("users.*", "users.profile.edit"); // false
```

### `users.profile.*`

`users.profile.*` matches exactly three segments:

```ts
matchPermission("users.profile.*", "users.profile.edit"); // true
matchPermission("users.profile.*", "users.profile.view"); // true
matchPermission("users.profile.*", "users.profile.avatar.upload"); // false
```

### Global `*`

The global wildcard `*` matches everything:

```ts
matchPermission("*", "users.create"); // true
matchPermission("*", "a.b.c.d"); // true
```

Use it carefully. It is effectively full frontend access.

### Why `users.*` Does Not Match `users.profile.edit`

Accessly segment wildcards are single-level. `users.*` has two segments, while `users.profile.edit` has three. Since the segment counts differ, the match fails.

This keeps wildcard behavior predictable and prevents accidental broad grants.

### Why Globstar `**` Is Not Supported

Accessly does not support recursive globstar matching. There is no `users.**` behavior.

This is a deliberate simplification:

- Easier to explain.
- Easier to test.
- Less likely to grant unexpected access.
- Matches the package's small, predictable API philosophy.

### How Wildcard Matching Relates to Other APIs

`Can`, `Cannot`, `ProtectedRoute`, `usePermission`, `useAccessDecision`, `filterNavigation`, and `checkPermission` all rely on the same core matching behavior.

If the model contains `users.*`, then:

```tsx
<Can permission="users.create">...</Can>
```

will be allowed.

### Why Most Users Do Not Call `matchPermission` Directly

Most users want a decision, not just a pattern match. `checkPermission` adds:

- Loading behavior.
- Feature flag checks.
- Role expansion.
- `any` and `all`.
- Unknown permission strategy.
- Explainable decision output.

Use `matchPermission` directly only for advanced custom logic.

## 10. Feature Flags

### Why Feature Flags Are Included

Modern apps often need both authorization and feature availability. A user may have permission to view reports, but the new report builder may still be disabled for their plan or tenant.

Accessly includes flags so the same provider and decision tools can answer feature availability questions.

### Difference Between Permissions and Flags

Permissions usually answer: "May this user perform this action?"

Flags usually answer: "Is this feature enabled for this user, tenant, plan, rollout, or environment?"

Keep them conceptually separate:

```ts
permissions: ["reports.export"]
flags: ["features.new-dashboard"]
```

### `Can` With Flag

```tsx
<Can permission={{ flag: "features.new-dashboard" }}>
  <NewDashboard />
</Can>
```

### `Cannot` With Flag

```tsx
<Cannot permission={{ flag: "features.audit-log" }}>
  <UpgradePrompt />
</Cannot>
```

### `useAccessDecision` With Flag

```tsx
const decision = useAccessDecision({
  flag: "features.advanced-export",
});

if (decision.reason === "missing_flag") {
  return <UpgradePrompt />;
}
```

### Plan-Based Access Example

A backend may map plans to flags:

```ts
{
  permissions: ["reports.view"],
  flags: ["features.csv-export", "features.saved-reports"]
}
```

Then the frontend can gate feature UI:

```tsx
<Can permission={{ flag: "features.csv-export" }}>
  <button>Export CSV</button>
</Can>
```

### Common Mistakes

- Treating flags as security. Backend APIs still need authorization.
- Mixing permission and flag naming without a convention.
- Checking a flag as a permission string instead of using `{ flag: "..." }`.
- Assuming `featureFlagsAdapter` produces permissions. It produces `flags`.

## 11. Explainable Decisions

### Why Decision Explanations Matter

Boolean checks answer "can the user do this?" Explainable decisions answer "why?"

This helps with:

- Debugging hidden UI.
- Writing tests.
- Supporting developers.
- Building admin/debug panels.
- Explaining wildcard and role behavior.

### Difference Between Boolean Access and Explainable Access

Boolean:

```ts
false
```

Explainable:

```ts
{
  allowed: false,
  reason: "missing_permission",
  requested: ["reports.export"],
  missing: ["reports.export"],
  checkedFrom: "none"
}
```

### Example Allowed Decision

```ts
checkPermission(
  { permissions: ["users.*"] },
  { permission: "users.create" },
);
```

Result:

```ts
{
  allowed: true,
  reason: "allowed",
  requested: ["users.create"],
  matched: ["users.*"],
  checkedFrom: "wildcard"
}
```

### Example Denied Decision

```ts
checkPermission(
  { permissions: ["users.view"] },
  { permission: "users.delete" },
);
```

Result:

```ts
{
  allowed: false,
  reason: "missing_permission",
  requested: ["users.delete"],
  missing: ["users.delete"],
  checkedFrom: "none"
}
```

### How to Show Decision Details in UI

```tsx
const decision = useAccessDecision("reports.export");

return (
  <div>
    <p>Allowed: {String(decision.allowed)}</p>
    <p>Reason: {decision.reason}</p>
    <p>Missing: {decision.missing?.join(", ") ?? "none"}</p>
  </div>
);
```

Use this mainly in internal tools, development panels, or support views. End users usually need simpler messages.

### `formatDecision`

`formatDecision(decision)` converts an `AccessDecision` into a readable string:

```ts
formatDecision({
  allowed: false,
  reason: "missing_permission",
  requested: ["users.delete"],
  missing: ["users.delete"],
  checkedFrom: "none",
});
```

Output:

```txt
Allowed: false
Reason: missing_permission
Requested: users.delete
Missing: users.delete
Checked from: none
```

### `inspectAccess`

`inspectAccess(model)` summarizes the active model:

```ts
inspectAccess({
  user: { id: "user_123", roles: ["admin"] },
  permissions: ["users.create"],
  flags: ["features.beta"],
});
```

Useful for:

- Debug panels.
- Support logging.
- Developer education.
- Verifying what the provider received.

### Debug `checkPermission`

The debug module also has a `checkPermission` wrapper that can warn once per unknown permission when `unknownPermission` is `"warn"`. The public package root exports the engine `checkPermission`, while `formatDecision` and `inspectAccess` are exported from debug.

## 12. TypeScript DX

Important exported types:

### `AccessModel`

The normalized model used by the engine, provider, hooks, components, and navigation helpers.

Why it matters: it is the main contract between an app's backend/session layer and Accessly.

### `AccessDecision`

The explainable result from `checkPermission` and `useAccessDecision`.

Why it matters: it gives developers structured information instead of an opaque boolean.

### `PermissionCheckInput`

The input shape for checks:

```ts
type PermissionCheckInput =
  | { permission: string }
  | { any: string[] }
  | { all: string[] }
  | { flag: string };
```

Why it matters: the same shape works across engine, hooks, and components.

### `NavigationItem`

The navigation item shape used by `filterNavigation` and `useFilteredNavigation`.

Why it matters: it gives apps a small convention for permission-aware menus.

### `AccessAdapter`

The adapter interface:

```ts
type AccessAdapter<TSource = unknown> = {
  normalize: (source: TSource) => AccessModel;
};
```

Why it matters: it lets apps normalize any backend response while preserving TypeScript types.

### `PermissionProviderProps`

The provider prop contract.

Why it matters: it documents the bridge between React Context, normalized access data, adapters, role expansion, registry validation, and loading.

## 13. Real-World Use Cases

### Admin Dashboard

Accessly can gate admin pages, destructive actions, navigation groups, and audit-log features:

```tsx
<ProtectedRoute permission="pages.admin" fallback={<Forbidden />}>
  <AdminDashboard />
</ProtectedRoute>
```

Backend APIs must still enforce admin permissions.

### SaaS Dashboard

SaaS apps often combine permissions and plan features:

```tsx
<Can permission={{ all: ["reports.view", "reports.export"] }}>
  <ExportReportButton />
</Can>

<Can permission={{ flag: "features.advanced-analytics" }}>
  <AdvancedAnalyticsPanel />
</Can>
```

### CMS

A CMS can use permissions like:

- `posts.create`
- `posts.edit`
- `posts.publish`
- `media.upload`

Editors might receive `posts.*` while contributors receive only `posts.create`.

### CRM

A CRM can gate accounts, contacts, exports, and admin settings:

```tsx
<Can permission="contacts.export">
  <button>Export contacts</button>
</Can>
```

### E-commerce

An e-commerce admin can use permissions like:

- `orders.view`
- `orders.refund`
- `products.edit`
- `discounts.create`

Accessly can hide refund buttons and filter operations navigation.

### HR System

HR apps can gate employee records, payroll views, onboarding settings, and reports:

```tsx
<Can permission="employees.compensation.view">
  <CompensationPanel />
</Can>
```

Use explicit permissions for sensitive HR areas. Avoid overly broad wildcards unless the role is truly trusted.

### Multi-Tenant Apps

When a user switches tenant, reload or replace the `AccessModel` for that tenant. The same user may have different roles, permissions, and flags in each tenant.

Do not merge all tenant permissions into one model unless the UI is intentionally operating across tenants.

### Feature-Gated Apps

Feature-gated apps can use flags to manage rollout, beta access, or plan capabilities:

```tsx
<Can permission={{ flag: "features.ai-assistant" }}>
  <AssistantPanel />
</Can>
```

Feature flags improve UX but do not secure backend capabilities by themselves.

## 14. Frequently Asked Questions

### If I Have 100 Users With the Same Permissions, Do I Pass All Users to Accessly?

No. Pass only the current user's access model. Accessly checks what the current session can do. It is not meant to receive a database of users.

If 100 users have the same permissions, each user's session can receive the same permission list, but the frontend still only needs the current session's list.

### Why Does `AccessModel` Include `user`?

Because access decisions often need session context. The current implementation uses `user.roles` for role-based permission expansion. `user.id` and `user.attributes` are useful for display, debugging, or app-specific wrappers.

The `user` field does not mean Accessly needs all users. It means Accessly can carry context about the current user.

### Why Do I Need `PermissionProvider`?

You need it when using React hooks or components. It stores access data in React Context so deeply nested components can check permissions without prop drilling.

If you are not using React, use `checkPermission` directly.

### Where Does `usePermission` Get Data From?

It reads the nearest `PermissionProvider`, then calls `checkPermission` with the provider's access model and options.

### Why Does `checkPermission` Require Access Data?

Because it is a pure function with no global state. You give it a model and a check input; it gives back a decision. This makes it predictable, testable, and usable outside React.

### Do I Need Wildcard Permissions?

No. Wildcards are optional. They are helpful when a role truly has all actions at a given permission level, such as `users.*`. Use explicit permissions when precision is more important than brevity.

### Does Accessly Secure My Backend?

No. Accessly helps the frontend render correctly and explain decisions. Backend APIs must still authorize every sensitive request.

### Can I Use Accessly With Zustand/Redux?

Yes. Store the `AccessModel` wherever you want, then either pass it to `PermissionProvider` or call `checkPermission` from selectors/helpers.

Example:

```ts
const canExport = checkPermission(accessModel, {
  permission: "reports.export",
}).allowed;
```

### Can I Use Accessly Without React?

Yes. Use the core engine:

```ts
import { checkPermission } from "accessly";

const decision = checkPermission(model, { permission: "users.create" });
```

The provider, hooks, and components are React-specific. The engine and adapters are not tied to rendering.

### Should Permissions Come From Backend or Frontend?

Usually from the backend. The backend is the source of truth for authorization. The frontend can normalize that response and use it for rendering.

Hard-coded frontend permissions are acceptable for demos, tests, prototypes, or static examples, but production apps should not trust frontend-only authorization.

### What Happens While Permissions Are Loading?

If the provider has `loading={true}` or the model has `isLoading: true`, checks return:

```ts
{ allowed: false, reason: "not_ready" }
```

Components show `loading` if provided, otherwise `fallback`, otherwise nothing.

### Should I Memoize the `AccessModel`?

Usually yes if you construct it inside a component. A stable object avoids unnecessary recalculation and rerenders.

Example:

```tsx
const access = useMemo(
  () => ({
    user: session.user,
    permissions: session.permissions,
    flags: session.flags,
  }),
  [session],
);
```

If the model comes directly from a stable query/cache result, extra memoization may not be needed.

### When Should I Use `Can` vs `usePermission`?

Use `Can` when declarative rendering is enough:

```tsx
<Can permission="users.create">
  <CreateUserButton />
</Can>
```

Use `usePermission` when you need the boolean in component logic:

```tsx
const canCreate = usePermission("users.create");
```

### When Should I Use `useAccessDecision`?

Use it when you need explanation data:

- Why was access denied?
- Which permission matched?
- Which permission is missing?
- Is access still loading?
- Was this a flag check?

### Why `ProtectedRoute` If `Can` Can Do Similar Rendering?

They have similar mechanics, but different intent. `Can` is a general UI gate. `ProtectedRoute` communicates route/page boundary semantics and makes route protection easier to read in code.

## 15. Elevator Pitches

### 1 Sentence Explanation

Accessly is a small React access-control helper that turns backend permissions and feature flags into explainable UI decisions.

### 30 Second Explanation

Accessly helps React apps avoid scattered permission checks. You pass the current user's normalized access model to a provider, then use components, hooks, or the core engine to check permissions, feature flags, routes, and navigation. Every check can return an explanation, so developers can see what was requested, what matched, and why access was denied.

### 2 Minute Explanation

Accessly solves a common frontend problem: permission logic gets scattered across buttons, routes, menus, and feature gates. Instead of hard-coding role checks everywhere, Accessly gives the app one normalized `AccessModel` for the current user. That model can include permissions, feature flags, roles, and user context.

React apps can wrap their UI in `PermissionProvider` and then use `Can`, `Cannot`, `ProtectedRoute`, `usePermission`, or `useAccessDecision`. Non-React code can call `checkPermission` directly. Backends can return different shapes because adapters normalize flat permissions, grouped actions, nested modules, page lists, or feature booleans.

The important differentiator is explainability. Accessly can tell you not only whether access is allowed, but also whether the app was loading, a permission was missing, a flag was missing, a wildcard matched, or a role expanded into the permission. It makes frontend access checks consistent and debuggable, while leaving real security enforcement where it belongs: the backend.

### Technical Explanation for Senior Engineers

Accessly is a stateless TypeScript permission engine plus a thin React Context layer. The core function, `checkPermission`, accepts an `AccessModel`, a discriminated `PermissionCheckInput`, and optional role/registry strategy. It returns a structured `AccessDecision`. React APIs are small wrappers around that engine. Adapters normalize backend-specific response shapes into the model, and navigation helpers apply the same checks to menu trees. It is not a policy server or backend authorization layer; it is a frontend consistency and explainability layer.

### Simple Explanation for Junior Developers

Accessly helps you avoid writing permission `if` statements everywhere. Put the current user's permissions in `PermissionProvider`, then write things like:

```tsx
<Can permission="users.create">
  <button>Create user</button>
</Can>
```

If the user has the permission, the button shows. If not, it hides or shows a fallback. If you need to know why, Accessly can give you the full decision.

## 16. Objection Handling

### "I Can Just Use If Statements."

Yes, and for a tiny app that may be enough. Accessly becomes useful when permission checks appear across many components, routes, menus, and feature gates. It centralizes the checking pattern and gives you explainable decisions instead of many slightly different `if` statements.

### "Why Not Just Check `user.role`?"

Roles are often too coarse for UI logic. An `admin` role might imply many capabilities today and different ones later. Checking capabilities such as `users.create` or `reports.export` makes components easier to understand and reduces coupling to role names. Accessly still supports roles through `rolePermissions` when apps need role expansion.

### "Why Not Use CASL?"

CASL is a powerful ability/policy library. Accessly is smaller and focused on normalized frontend permission strings, React rendering helpers, adapters, navigation filtering, feature flags, and explainable decisions. If an app needs rich subject/action conditions and policy modeling, CASL may be a better fit. If an app wants lightweight string-based checks with clear React ergonomics, Accessly is simpler to explain and adopt.

### "Why Do I Need Adapters?"

Adapters keep backend response quirks out of UI components. Without adapters, every component may need to know whether permissions came from `permissions`, `roles`, `features`, `modules`, or `pages`. With adapters, the app normalizes once at the edge and the rest of the UI reads `AccessModel`.

### "Is This Overengineering?"

It can be overkill for a small page with one permission check. It is practical when access logic appears in multiple places or when developers need to debug why UI is hidden. The package stays small: the core is a pure check function, React wrappers, adapters, navigation filtering, and debug formatting.

### "Frontend Authorization Is Useless."

Frontend authorization is useless as a security boundary, but useful as a UX and consistency layer. Users should not see buttons, menus, or pages that they cannot use. Developers should be able to explain why something is hidden. The backend still enforces the actual security.

### "Why Should I Trust This Package?"

Trust it for what it claims to do: normalize access data, evaluate frontend permission/flag checks, render React UI based on decisions, filter navigation, and explain outcomes. Do not trust it as backend security. The implementation is small enough to inspect, and the public behavior is covered by focused tests for engine checks, wildcard matching, adapters, components, hooks, provider behavior, navigation, and debug helpers.

## 17. Recommended Talking Points

### Facebook Comments

- Accessly is for keeping React permission checks consistent, not replacing backend security.
- You pass the current user's permissions once, then use `Can`, hooks, or route guards across the UI.
- The useful part is that decisions are explainable, so you can debug why something was hidden.

### LinkedIn Comments

- Accessly solves the frontend side of authorization: consistent rendering, navigation filtering, feature gates, and debuggable decisions.
- It pairs well with backend authorization because the backend remains the source of truth while the frontend reflects it cleanly.
- It is intentionally lightweight: normalized access model, pure engine, React helpers, adapters, and TypeScript types.

### GitHub Issues

- Please include the `AccessModel`, the permission input, and the resulting `AccessDecision`; that usually makes permission issues clear.
- If a wildcard behaves unexpectedly, check segment count. `users.*` matches `users.create`, not `users.profile.edit`.
- If hooks throw, verify the component is rendered inside `PermissionProvider`.
- If loading renders the fallback, pass a dedicated `loading` prop to `Can`, `Cannot`, or `ProtectedRoute`.

### npm Users

- Install with `npm install accessly`.
- React is a peer dependency.
- Start by passing an `AccessModel` to `PermissionProvider` and rendering a `Can` component.
- Use adapters when your backend response does not already match `AccessModel`.

### Technical Reviewers

- The core engine is pure and receives access data explicitly.
- React APIs are wrappers around `checkPermission`.
- Unknown permission handling is registry-based and configurable.
- Wildcard matching is segment-based, with no recursive globstar behavior.
- The package improves frontend UX and diagnostics but does not claim backend enforcement.

## Known Limitations

- Accessly is not backend authorization.
- It does not evaluate complex attribute-based rules in the core engine.
- `user.attributes` are carried in the model but not interpreted by built-in checks.
- Wildcards are segment-based only; recursive `**` matching is not supported.
- `ProtectedRoute` does not integrate with or redirect through a router automatically.
- Adapters are simple normalizers, not policy evaluators.
- The provider prefers `access` over `source + adapter`; it does not merge both.

## API Areas That Need Better Docs

- The difference between root-exported `checkPermission` and the debug wrapper in `src/debug`.
- More examples for `registry` and `unknownPermission`.
- More guidance on role expansion with `rolePermissions`.
- More examples showing tenant switching and model replacement.
- More router-specific examples for `ProtectedRoute`.
- More explicit docs about loading fallback precedence.
- More advanced examples for combining permissions and feature flags.

## Maintainer Summary

When explaining Accessly, lead with this:

Accessly is a frontend access-control toolkit for React apps. It uses the current user's normalized access model to render UI, filter navigation, check permissions and feature flags, and explain every decision. It makes frontend access logic consistent and debuggable, while backend authorization remains mandatory.
