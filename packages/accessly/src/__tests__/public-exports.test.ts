import { describe, expect, it } from "vitest";
import * as accessly from "accessly";

const publicRuntimeExports = [
  "PermissionProvider",
  "Can",
  "Cannot",
  "ProtectedRoute",
  "usePermission",
  "useAccessDecision",
  "useAccessModel",
  "checkPermission",
  "matchPermission",
  "createAccessChecker",
  "createAdapter",
  "createActionsAdapter",
  "directPermissionsAdapter",
  "featureFlagsAdapter",
  "nestedModulesAdapter",
  "pagesOnlyAdapter",
  "filterNavigation",
  "useFilteredNavigation",
  "formatDecision",
  "inspectAccess",
  "isAccessAdapter",
  "isAccessDecision",
  "isAccessModel",
  "isNavigationItem",
  "isPermissionCheckInput",
] as const;

describe("public runtime exports", () => {
  it("keeps the root import surface available", () => {
    for (const exportName of publicRuntimeExports) {
      expect(accessly).toHaveProperty(exportName);
      expect(typeof accessly[exportName]).toBe("function");
    }
  });
});
