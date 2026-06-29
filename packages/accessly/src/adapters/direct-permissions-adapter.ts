import type { AccessModel } from "../types";

/** Adapter for backends that return a flat list of permission strings. */
export function directPermissionsAdapter(
  source: { permissions?: string[]; roles?: string[]; flags?: string[] },
): AccessModel {
  return {
    user: { roles: source.roles },
    permissions: source.permissions ?? [],
    flags: source.flags ?? [],
  };
}
