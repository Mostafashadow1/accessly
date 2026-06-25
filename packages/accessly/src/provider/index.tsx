import React, { createContext, useContext, useMemo } from "react";
import type {
  AccessModel,
  AccessAdapter,
  RolePermissions,
} from "../types/access";

export type PermissionProviderProps = {
  children: React.ReactNode;
  access?: AccessModel | null;
  source?: unknown;
  adapter?: AccessAdapter<unknown>;
  rolePermissions?: RolePermissions;
  registry?: readonly string[];
  unknownPermission?: "ignore" | "warn" | "throw";
  loading?: boolean;
};

type AccessContextValue = {
  model: AccessModel | null;
  rolePermissions?: RolePermissions;
  registry?: readonly string[];
  unknownPermission?: "ignore" | "warn" | "throw";
  loading: boolean;
};

const AccessContext = createContext<AccessContextValue | null>(null);

export function useAccessContext(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error(
      "Accessly: usePermission hooks must be used inside <PermissionProvider>.",
    );
  }
  return ctx;
}

export function PermissionProvider({
  children,
  access,
  source,
  adapter,
  rolePermissions,
  registry,
  unknownPermission,
  loading = false,
}: PermissionProviderProps) {
  const model = useMemo<AccessModel | null>(() => {
    if (access) return access;
    if (source && adapter) return adapter.normalize(source);
    return null;
  }, [access, source, adapter]);

  const value = useMemo<AccessContextValue>(
    () => ({
      model,
      rolePermissions,
      registry,
      unknownPermission,
      loading,
    }),
    [model, rolePermissions, registry, unknownPermission, loading],
  );

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
}
