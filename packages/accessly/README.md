# Accessly

**Explainable access control for React and Next.js.**

Accessly helps teams replace scattered permission checks like `user.role === "admin"` with a clean, centralized API — and every decision comes with a full explanation of why it was allowed or denied.

```bash
pnpm add accessly
```

## Quick Start

```tsx
import { PermissionProvider, Can } from "accessly";

function App() {
  return (
    <PermissionProvider access={{ permissions: ["users.create"] }}>
      <Can permission="users.create">
        <button>Create User</button>
      </Can>
    </PermissionProvider>
  );
}
```

## Features

- **PermissionProvider** — Context provider for access state
- **Can / Cannot** — Declarative component guards
- **ProtectedRoute** — Route protection without router dependency
- **usePermission / useAccessDecision / useAccessModel** — Hooks for granular control
- **Explain Engine** — Every decision includes reason, matched, missing fields
- **Backend Adapters** — Normalize any backend shape into AccessModel
- **RBAC** — Role-based permission expansion
- **Wildcards** — `users.*` matches `users.create`, `users.delete`
- **Feature Flags** — Built-in flag support
- **Sidebar Filtering** — Filter navigation items by permissions
- **Debug Helpers** — `formatDecision`, `inspectAccess`, unknown permission warnings

## Documentation

Full docs and interactive showcases are available at the [docs site](https://accessly.dev).

---

## Known V1 Limitations

Accessly is designed to be simple, explainable, and composable. The following limitations are intentional in V1 to keep the API small and the bundle lightweight.

### 1. Wildcards are single-level prefix patterns only

Wildcards expand one segment at a time:

| Pattern  | Matches                        | Does Not Match          |
|----------|--------------------------------|-------------------------|
| `*`      | `anything`, `a.b`, `x.y.z`    | — (matches everything)  |
| `users.*` | `users.create`, `users.delete` | `users.profile.edit`   |
| `*.create` | `users.create`, `posts.create` | `users.profile.create` |

> **Globstar (`**`) is not supported in V1.** Patterns like `users.**` or `a.**.b` will not match deeper nesting. If you need deep wildcard matching, flatten your permission model or add explicit permissions for each nesting level.

### 2. Feature flags are exact-match only

Flag checks compare the exact string:

```ts
checkPermission(model, { flag: "features.beta-dashboard" });
```

This returns `allowed: true` only if `model.flags` contains `"features.beta-dashboard"`.

> **Prefix matching (`features.*`) is not supported for flag checks in V1.** Flags are identifiers, not hierarchical paths. If you need flag namespacing, use a naming convention like `features.beta.dashboard` and match the full string.

### 3. Navigation items accept one permission string

```ts
type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;  // single string only in V1
  children?: NavigationItem[];
};
```

> **Object-form checks (`any` / `all` / `flag`) are not supported on navigation items in V1.** If you need complex navigation rules (e.g., "show this item when any of these permissions match"), call `checkPermission` manually in your sidebar component. Expanded navigation rules are planned for V2.

### 4. Adapter output is trusted

```ts
const adapter = createAdapter((source) => ({
  permissions: source.perms,
  flags: source.featureFlags,
}));
```

Accessly treats the `AccessModel` returned by your adapter as authoritative.

> **No runtime validation is performed on adapter output in V1.** If an adapter returns an ill‑formed model (e.g., `permissions: null`), Accessly falls back to `?? []` internally, but structural errors like missing required fields are not reported. This keeps bundle size small. Production adapters should validate their own source data before returning.

---

## License

MIT
