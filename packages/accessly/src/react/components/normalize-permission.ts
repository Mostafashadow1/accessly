import type { PermissionCheckInput } from "../../types";
import type { PermissionProp } from "./types";

export function normalizePermission(
  permission: PermissionProp,
): PermissionCheckInput {
  return typeof permission === "string" ? { permission } : permission;
}
