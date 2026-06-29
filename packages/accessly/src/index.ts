// Accessly — Explainable access control for React

// Types
export type {
  AccessModel,
  NavigationItem,
  AccessDecision,
  RolePermissions,
  PermissionCheckInput,
  AccessAdapter,
} from "./types";
export {
  isAccessAdapter,
  isAccessDecision,
  isAccessModel,
  isNavigationItem,
  isPermissionCheckInput,
} from "./types";

// Engine
export { checkPermission, createAccessChecker, matchPermission } from "./engine";

// Adapters
export {
  createAdapter,
  directPermissionsAdapter,
  createActionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featureFlagsAdapter,
} from "./adapters";

// Provider
export { PermissionProvider } from "./react/provider";
export type { PermissionProviderProps } from "./react/provider";

// Hooks
export {
  usePermission,
  useAccessDecision,
  useAccessModel,
} from "./react/hooks";

// Components
export { Can, Cannot, ProtectedRoute } from "./react/components";

// Navigation
export { filterNavigation } from "./navigation";
export { useFilteredNavigation } from "./react/hooks";

// Debug
export { formatDecision, inspectAccess } from "./debug";
