<p align="center">
  <img
    src="https://raw.githubusercontent.com/Mostafashadow1/accessly/main/packages/accessly/assets/accessly-readme.webp"
    alt="Accessly - Explainable access control for React"
    width="100%"
  />
</p>

<h1 align="center">Accessly</h1>

<p align="center">
  Explainable access control for React and Next.js.
</p>

<p align="center">
  <a href="https://accessly-website.vercel.app/"><strong>Website</strong></a>
  ·
  <a href="https://accessly-website.vercel.app/docs">Docs</a>
  ·
  <a href="https://accessly-website.vercel.app/lab">Lab</a>
  ·
  <a href="https://www.npmjs.com/package/accessly">npm</a>
  ·
  <a href="https://bundlephobia.com/package/accessly">Bundle size</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/accessly"><img alt="npm version" src="https://img.shields.io/npm/v/accessly?color=7c5cff" /></a>
  <a href="https://bundlephobia.com/package/accessly"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/accessly?label=minzip&color=22c55e" /></a>
  <a href="https://www.npmjs.com/package/accessly"><img alt="dependencies" src="https://img.shields.io/badge/runtime%20deps-0-22c55e" /></a>
  <a href="https://github.com/Mostafashadow1/accessly/blob/main/packages/accessly/package.json"><img alt="tree shaking" src="https://img.shields.io/badge/tree--shaking-friendly-7c5cff" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6" /></a>
  <a href="https://github.com/Mostafashadow1/accessly/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-8b95b7" /></a>
</p>

Accessly is a small React permission layer for rendering UI from a normalized access model. It provides permission components, hooks, backend adapters, navigation filtering, feature flag checks, RBAC expansion, wildcard matching, and explainable allow/deny decisions.

This repository contains the published `accessly` package and the public website/docs/Lab.

## Why Accessly?

Frontend access logic often starts as simple conditionals and grows into scattered role checks, permission strings, feature flag branches, and duplicated navigation rules.

Accessly gives React apps one consistent way to ask access questions:

- Can this user see this UI?
- Which permission matched?
- Was access granted directly, through a role, by wildcard, or by feature flag?
- Which permission is missing?
- Can this backend response be normalized without changing the backend?

## Package Features

- **PermissionProvider** for supplying access data to React.
- **Can, Cannot, ProtectedRoute** for declarative UI gating.
- **usePermission** for boolean permission checks.
- **useAccessDecision** for inspectable allow/deny decisions.
- **useAccessModel** for reading the normalized model.
- **RBAC expansion** with `rolePermissions`.
- **Wildcard permissions** such as `users.*`, `reports.*`, and `*`.
- **Feature flag checks** with `{ flag: "features.new-dashboard" }`.
- **Backend adapters** with `createAdapter`.
- **Built-in adapters** for flat permissions, grouped actions, pages, nested modules, and feature flags.
- **Navigation filtering** with nested menu support.
- **Debug utilities** for formatting decisions and inspecting access models.
- **TypeScript declarations** for ESM and CJS consumers.
- **Zero runtime dependencies**: no regular `dependencies`; React is a peer dependency.
- **Tree-shaking friendly**: ESM build, package exports, and `"sideEffects": false`.

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

## Quick Start

```tsx
import { PermissionProvider, Can } from "accessly";

export function App() {
  return (
    <PermissionProvider
      access={{
        user: { id: "user_1", roles: ["admin"] },
        permissions: ["users.create", "reports.view"],
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

## Explainable Decisions

Accessly does not only return `true` or `false`. It returns a decision object that explains the result.

```tsx
import { useAccessDecision } from "accessly";

export function ExportButton() {
  const decision = useAccessDecision("reports.export");

  if (!decision.allowed) {
    return <span>Missing: {decision.missing?.join(", ")}</span>;
  }

  return <button>Export report</button>;
}
```

Example decision:

```json
{
  "allowed": true,
  "reason": "allowed",
  "requested": ["reports.export"],
  "matched": ["reports.*"],
  "checkedFrom": "wildcard"
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

export function Product({ user }: { user: BackendUser }) {
  return (
    <PermissionProvider source={user} adapter={backendAdapter}>
      <App />
    </PermissionProvider>
  );
}
```

## Website

The public website is deployed here:

[https://accessly-website.vercel.app/](https://accessly-website.vercel.app/)

Useful routes:

- Docs: [https://accessly-website.vercel.app/docs](https://accessly-website.vercel.app/docs)
- AI prompts: [https://accessly-website.vercel.app/docs/ai](https://accessly-website.vercel.app/docs/ai)
- Use cases: [https://accessly-website.vercel.app/docs/use-cases](https://accessly-website.vercel.app/docs/use-cases)
- Lab: [https://accessly-website.vercel.app/lab](https://accessly-website.vercel.app/lab)

## Monorepo Structure

This repository is a pnpm monorepo.

```text
apps/
  website/       Website, docs, and Accessly Lab
packages/
  accessly/      Published accessly package
```

## Development

Install dependencies:

```bash
pnpm install
```

Run all workspace builds:

```bash
pnpm build
```

Run package build:

```bash
pnpm --filter accessly build
```

Run website build:

```bash
pnpm --filter website build
```

Run tests:

```bash
pnpm test
```

## Package Links

- npm: [https://www.npmjs.com/package/accessly](https://www.npmjs.com/package/accessly)
- Bundle size: [https://bundlephobia.com/package/accessly](https://bundlephobia.com/package/accessly)
- Package README: [packages/accessly/README.md](packages/accessly/README.md)
- Package source: [packages/accessly/src](packages/accessly/src)

## Security Note

Accessly controls frontend rendering. It helps React apps hide, show, explain, and organize UI based on access data.

It does **not** replace server-side authorization. Sensitive actions, private API routes, data fetching, mutations, billing operations, and admin actions must still be authorized on the server.

## License

MIT
