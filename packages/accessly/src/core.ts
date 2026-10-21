// Accessly core — the React-free part of Accessly.
// Safe to import from Server Components, Route Handlers, middleware and Node.

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

// Navigation
export { filterNavigation } from "./navigation";

// Debug
export { formatDecision, inspectAccess } from "./debug";
