# Accessly

Explainable access control for React and Next.js.

```bash
pnpm add accessly
```

```tsx
import { PermissionProvider, Can } from "accessly";

<PermissionProvider access={access}>
  <Can permission="users.create">
    <CreateUserButton />
  </Can>
</PermissionProvider>
```

## Packages

- `accessly` — Core package (engine, adapters, React components, hooks)
- `apps/docs` — Documentation and showcase app
