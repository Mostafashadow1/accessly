import { useMemo } from "react";
import type { AccessModel, PermissionProviderProps } from "../../types";
import { AccessContext, type AccessContextValue } from "./permission-context";

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
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}
