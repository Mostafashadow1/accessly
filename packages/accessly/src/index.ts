// Accessly — Explainable access control for React

// Types
export type {
  AccessModel,
  NavigationItem,
  AccessDecision,
  RolePermissions,
  PermissionCheckInput,
  AccessAdapter,
} from "./types/access";

// Engine
export { checkPermission, matchPermission } from "./engine";

// Adapters
export {
  createAdapter,
  directPermissionsAdapter,
  createActionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featureFlagsAdapter,
} from "./adapter";

// Provider
export { PermissionProvider } from "./provider";
export type { PermissionProviderProps } from "./provider";

// Hooks
export { usePermission, useAccessDecision, useAccessModel } from "./hooks";

// Components
export { Can, Cannot, ProtectedRoute } from "./components";

// Navigation
export { filterNavigation, useFilteredNavigation } from "./navigation";

// Debug
export { formatDecision, inspectAccess } from "./debug";
