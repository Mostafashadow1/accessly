import type { RolePermissions } from "../types";

export function expandRolePermissions(
  roles: string[] | undefined,
  rolePermissions: RolePermissions | undefined,
): string[] {
  if (!roles || !rolePermissions) return [];
  const expanded: string[] = [];
  for (const role of roles) {
    const perms = rolePermissions[role];
    if (perms) {
      expanded.push(...perms);
    }
  }
  return expanded;
}
