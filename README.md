<p align="center">
  <img src="/packages/accessly/assets/accessly-readme.webp" alt="Accessly logo" />
</p>

<h1 align="center">Accessly</h1>

<p align="center">
  Explainable access control for React.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/accessly"><img alt="npm" src="https://img.shields.io/npm/v/accessly?color=7c5cff" /></a>
  <a href="https://github.com/Mostafashadow1/accessly"><img alt="license" src="https://img.shields.io/badge/license-MIT-8b95b7" /></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6" />
  <img alt="React" src="https://img.shields.io/badge/React-first-61dafb" />
</p>

Accessly is a React-first access control library for rendering UI from a clear, normalized access model. It gives you permission components, hooks, backend adapters, navigation filtering, and explainable allow/deny decisions without forcing your backend into a new shape.

## Why Accessly?

Frontend permission logic often starts small and then spreads across components as string checks, role checks, feature flag checks, and copied conditionals. Accessly centralizes that logic behind a small API so product UI can ask permission questions consistently.

Accessly is designed to help you:

- Keep permission checks readable in React components.
- Normalize backend permission payloads into one `AccessModel`.
- Render allowed and denied UI with `Can` and `Cannot`.
- Inspect why a decision was allowed or denied.
- Filter navigation from the same access model.
- Keep frontend access control complementary to backend authorization.

## Key Features

- `PermissionProvider` for supplying the current access model.
- `Can` and `Cannot` for declarative UI gating.
- `usePermission` for boolean checks in custom components.
- `useAccessDecision` for explainable decisions.
- `createAdapter` for normalizing backend responses.
- `filterNavigation` for permission-aware navigation.
- TypeScript-first API with small, composable primitives.

## Installation

Default:

```bash
npm install accessly
```

Other package managers:

```bash
pnpm add accessly
yarn add accessly
bun add accessly
```

## Quick Start

```tsx
import { PermissionProvider, Can } from "accessly";

export function App() {
  return (
    <PermissionProvider
      access={{
        permissions: ["users.create", "reports.view"],
      }}
    >
      <Can permission="users.create">
        <button>Create user</button>
      </Can>
    </PermissionProvider>
  );
}
```

## Backend Adapter Example

Use `createAdapter` when your backend returns a shape that is not already an Accessly `AccessModel`.

```tsx
import { PermissionProvider, createAdapter } from "accessly";

type BackendUser = {
  id: string;
  roles: string[];
  permissions: string[];
  featureFlags: string[];
};

const backendAdapter = createAdapter((source: BackendUser) => ({
  user: {
    id: source.id,
    roles: source.roles,
  },
  permissions: source.permissions,
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

## Can / Cannot Example

```tsx
import { Can, Cannot } from "accessly";

export function UserActions() {
  return (
    <>
      <Can permission="users.invite" fallback={<span>Invite unavailable</span>}>
        <button>Invite user</button>
      </Can>

      <Cannot permission="billing.manage">
        <p>You do not have access to billing settings.</p>
      </Cannot>
    </>
  );
}
```

## Hooks Example

```tsx
import { usePermission, useAccessDecision } from "accessly";

export function BillingLink() {
  const canViewBilling = usePermission("billing.view");
  const decision = useAccessDecision("billing.manage");

  if (!canViewBilling) return null;

  return (
    <a href="/billing" title={decision.reason}>
      Billing
    </a>
  );
}
```

## Navigation Filtering Example

```tsx
import {
  filterNavigation,
  type AccessModel,
  type NavigationItem,
} from "accessly";

const navigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard.view" },
  { label: "Users", href: "/users", permission: "users.view" },
  { label: "Billing", href: "/billing", permission: "billing.view" },
];

export function getVisibleNavigation(access: AccessModel) {
  return filterNavigation(navigation, access);
}
```

## Explainable Decision Example

```tsx
import { useAccessDecision } from "accessly";

export function DecisionDebug() {
  const decision = useAccessDecision("reports.export");

  return (
    <pre>
      {JSON.stringify(
        {
          allowed: decision.allowed,
          reason: decision.reason,
          matched: decision.matched,
          missing: decision.missing,
          checkedFrom: decision.checkedFrom,
        },
        null,
        2,
      )}
    </pre>
  );
}
```

## Known V1 Limitations

Accessly V1 intentionally keeps the API small.

- Wildcard permission matching is prefix-oriented and does not support deep globstar patterns like `users.**`.
- Feature flag checks are exact-match only.
- Navigation items support a single `permission` string.
- Adapter output is trusted. Validate backend data before returning an `AccessModel` in production.
- Frontend UI gating is not a security boundary.

## Security Note

Accessly helps React applications render the right UI for the current user. It complements backend authorization; it does not replace it. Sensitive actions and data access must still be authorized on the server.

## Workspace

This repository is a pnpm monorepo.

- `packages/accessly` - the stable Accessly package.
- `apps/website` - the website, docs, and Lab.

Stable website routes:

- `/`
- `/docs`
- `/lab`

## Development

```bash
pnpm install
pnpm type-check
pnpm build
pnpm test
```

Useful package-level commands:

```bash
pnpm --filter accessly type-check
pnpm --filter accessly build
pnpm --filter website type-check
pnpm --filter website build
```

## Links

- Docs: [https://accessly.dev/docs](https://accessly.dev/docs)
- Lab: [https://accessly.dev/lab](https://accessly.dev/lab)
- npm: [https://www.npmjs.com/package/accessly](https://www.npmjs.com/package/accessly)
- GitHub: [https://github.com/Mostafashadow1/accessly](https://github.com/Mostafashadow1/accessly)

## License

MIT
