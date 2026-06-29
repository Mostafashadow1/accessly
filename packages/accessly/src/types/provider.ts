import type React from "react";
import type { AccessAdapter } from "./adapter";
import type { AccessModel } from "./access-model";
import type { RolePermissions } from "./role-permissions";

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
