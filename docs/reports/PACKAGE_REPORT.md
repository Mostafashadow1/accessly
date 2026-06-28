# Accessly Package Report

## Purpose

Accessly provides explainable access control for React and Next.js applications. It replaces scattered role and permission checks with a typed access model, permission engine, React provider, hooks, components, navigation filtering, adapters, and debug helpers.

## Public API

Exports from `accessly`:

- Types: `AccessModel`, `NavigationItem`, `AccessDecision`, `RolePermissions`, `PermissionCheckInput`, `AccessAdapter`
- Engine: `checkPermission`, `matchPermission`
- Adapters: `createAdapter`, `directPermissionsAdapter`, `createActionsAdapter`, `pagesOnlyAdapter`, `nestedModulesAdapter`, `featureFlagsAdapter`
- React provider: `PermissionProvider`
- Hooks: `usePermission`, `useAccessDecision`, `useAccessModel`
- Components: `Can`, `Cannot`, `ProtectedRoute`
- Navigation: `filterNavigation`, `useFilteredNavigation`
- Debug: `formatDecision`, `inspectAccess`

## Features

- Direct permission checks.
- `any` and `all` permission checks.
- Feature flag checks.
- Role permission expansion.
- Single-level wildcard permission matching.
- Loading/not-ready decisions.
- Declarative React rendering with fallback and loading states.
- Render-prop access to full decisions.
- Navigation pruning by permission.
- Adapter normalization for common backend shapes.
- Human-readable debug output.

## Engine Architecture

The engine takes an `AccessModel`, a `PermissionCheckInput`, and optional role/registry options. It expands role permissions, evaluates flags and permissions, reports matched and missing permissions, and returns an `AccessDecision` with an explicit reason.

Decision reasons include:

- `allowed`
- `missing_permission`
- `missing_flag`
- `unknown_permission`
- `not_ready`
- `invalid_request`

## Adapter System

Adapters normalize backend-specific payloads into the Accessly `AccessModel`. The package includes helpers for direct permission lists, resource-action maps, page access, nested modules, and feature flags. Custom adapters are created with `createAdapter`.

## React Layer

`PermissionProvider` stores the normalized access model and provider-level options. Hooks and components read that context and call the engine. The React layer does not own routing, fetching, or backend policy.

## Hooks

- `usePermission(input)` returns a boolean.
- `useAccessDecision(input)` returns the full decision object.
- `useAccessModel()` returns the current model or loading model.

## Components

- `Can` renders children when a check is allowed.
- `Cannot` renders children when a check is denied.
- `ProtectedRoute` behaves like `Can` for route-level composition without coupling to a router.

## Navigation Helpers

`filterNavigation` removes navigation items that fail permission checks and prunes parents when all children are removed. `useFilteredNavigation` memoizes the filtered result for React.

## Debug And Explain Helpers

`formatDecision` formats decisions for logs and UI. `inspectAccess` summarizes the current access model. The debug wrapper can warn once per unknown permission when configured.

## Tests

The package has 136 passing Vitest test cases across:

- Permission engine
- Wildcard matching
- Built-in adapters
- Custom adapter creation
- Provider context
- Hooks
- Components
- Navigation filtering
- Debug helpers

## Known Limitations

- Wildcards are intentionally simple V1 patterns, not deep globstars.
- Feature flags are exact-match identifiers.
- Navigation items accept a single `permission` string.
- Adapter output is trusted and not deeply runtime-validated.
- The public export surface is single-entry only; subpath exports are not defined.

## Edge Cases Covered

- Missing or loading access models.
- Direct, role, and wildcard matches.
- Denied `any` and `all` checks.
- Missing feature flags.
- Fallback rendering in React components.
- Empty navigation branches.
- Unknown permission warning behavior.

## Release Risks

- External testers may expect router-specific helpers; V1 intentionally avoids that coupling.
- External testers may expect complex navigation rules; V1 supports only one permission per nav item.
- Adapter misuse can produce incomplete models because adapters are trusted.
- Website docs must stay aligned with the package's intentionally small V1 scope.

## Verification

- `pnpm test` passed.
- `pnpm type-check` passed.
- `pnpm build` passed.
