import { createContext, useContext } from "react";
import type { AccessModel, RolePermissions } from "../../types";

export type AccessContextValue = {
  model: AccessModel | null;
  rolePermissions?: RolePermissions;
  registry?: readonly string[];
  unknownPermission?: "ignore" | "warn" | "throw";
  loading: boolean;
};

export const AccessContext = createContext<AccessContextValue | null>(null);

export function useAccessContext(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error(
      "Accessly: usePermission hooks must be used inside <PermissionProvider>.",
    );
  }
  return ctx;
}
