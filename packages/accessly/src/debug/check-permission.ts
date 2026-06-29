import type {
  AccessDecision,
  AccessModel,
  PermissionCheckInput,
  RolePermissions,
} from "../types";
import {
  checkPermission as engineCheckPermission,
  isUnknownPermission,
} from "../engine";

const warnedPermissions = new Set<string>();

function warnOnce(permission: string): void {
  if (!warnedPermissions.has(permission)) {
    warnedPermissions.add(permission);
    console.warn(
      `[Accessly] Unknown permission checked: "${permission}". ` +
        "Add it to the registry or provide it in the access model.",
    );
  }
}

/**
 * Check permission with debug warnings.
 *
 * Same API as the core engine, but when `unknownPermission` is `"warn"` it
 * also logs a warning for each unknown permission in a denied decision.
 * Warnings are deduplicated (each unique permission is warned at most once).
 */
export function checkPermission(
  model: AccessModel | null | undefined,
  input: PermissionCheckInput,
  options?: {
    rolePermissions?: RolePermissions;
    unknownPermission?: "ignore" | "warn" | "throw";
    registry?: readonly string[];
  },
): AccessDecision {
  const decision = engineCheckPermission(model, input, options);

  if (
    options?.unknownPermission === "warn" &&
    !decision.allowed &&
    decision.missing &&
    decision.missing.length > 0
  ) {
    for (const perm of decision.missing) {
      if (isUnknownPermission(perm, options.registry)) {
        warnOnce(perm);
      }
    }
  }

  return decision;
}

/** @internal Reset warning cache (useful for testing). */
export function resetWarnings(): void {
  warnedPermissions.clear();
}
