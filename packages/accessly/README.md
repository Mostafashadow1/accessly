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
- **usePermission / usePermissionResult** — Hooks for granular control
- **Explain Engine** — Every decision includes reason, matched, missing fields
- **Backend Adapters** — Normalize any backend shape into AccessModel
- **RBAC** — Role-based permission expansion
- **Wildcards** — `users.*` matches `users.create`, `users.delete`
- **Feature Flags** — Built-in flag support
- **Sidebar Filtering** — Filter navigation items by permissions
- **Debug Helpers** — `formatDecision`, `inspectAccess`, unknown permission warnings

## Documentation

Full docs and interactive showcases are available at the [docs site](https://accessly.dev).

## License

MIT
