import type {
  AccessModel,
  AccessDecision,
  RolePermissions,
  PermissionCheckInput,
} from "../types/access";
import { matchPermission } from "./match-permission";

type CheckedFrom = AccessDecision["checkedFrom"];

function expandRolePermissions(
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

/**
 * Find the first effective permission that matches `target`.
 * Returns the matching permission string and metadata about its origin.
 */
function findMatch(
  effectivePermissions: string[],
  directCount: number,
  target: string,
): { matched: string; checkedFrom: CheckedFrom } | null {
  for (let i = 0; i < effectivePermissions.length; i++) {
    const perm = effectivePermissions[i];
    if (matchPermission(perm, target)) {
      const isWildcard = perm.includes("*");
      const isFromRole = i >= directCount;
      const checkedFrom: CheckedFrom = isWildcard
        ? isFromRole
          ? "role"
          : "wildcard"
        : isFromRole
          ? "role"
          : "direct";
      return { matched: perm, checkedFrom };
    }
  }
  return null;
}

export function checkPermission(
  model: AccessModel | null | undefined,
  input: PermissionCheckInput,
  options?: {
    rolePermissions?: RolePermissions;
    unknownPermission?: "ignore" | "warn" | "throw";
    registry?: readonly string[];
  },
): AccessDecision {
  // Not ready
  if (!model || model.isLoading) {
    return {
      allowed: false,
      reason: "not_ready",
    };
  }

  const permissions = model.permissions ?? [];
  const flags = model.flags ?? [];
  const roles = model.user?.roles;
  const rolePermissions = options?.rolePermissions;

  // Expand role-based permissions
  const roleBasedPermissions = expandRolePermissions(roles, rolePermissions);
  const effectivePermissions = [...permissions, ...roleBasedPermissions];
  const directCount = permissions.length;

  // Flag check
  if ("flag" in input) {
    const flag = input.flag;
    const hasFlag = flags.includes(flag);
    return {
      allowed: hasFlag,
      reason: hasFlag ? "allowed" : "missing_flag",
      requested: [flag],
      missing: hasFlag ? undefined : [flag],
      matched: hasFlag ? [flag] : undefined,
      checkedFrom: "flag",
    };
  }

  // Single permission
  if ("permission" in input) {
    return checkSinglePermission(
      effectivePermissions,
      directCount,
      input.permission,
      options?.unknownPermission,
      options?.registry,
    );
  }

  // any
  if ("any" in input) {
    const requested = input.any;
    for (const perm of requested) {
      const result = findMatch(effectivePermissions, directCount, perm);
      if (result) {
        return {
          allowed: true,
          reason: "allowed",
          requested,
          matched: [result.matched],
          checkedFrom: result.checkedFrom,
        };
      }
    }
    return {
      allowed: false,
      reason: "missing_permission",
      requested,
      missing: requested,
      checkedFrom: "none",
    };
  }

  // all
  if ("all" in input) {
    const requested = input.all;
    const missing: string[] = [];
    const matched: string[] = [];
    let finalCheckedFrom: CheckedFrom = "none";

    for (const perm of requested) {
      const result = findMatch(effectivePermissions, directCount, perm);
      if (result) {
        matched.push(result.matched);
        // Upgrade checkedFrom: role > wildcard > direct
        if (result.checkedFrom === "role") finalCheckedFrom = "role";
        else if (result.checkedFrom === "wildcard" && finalCheckedFrom !== "role") {
          finalCheckedFrom = "wildcard";
        } else if (finalCheckedFrom === "none") {
          finalCheckedFrom = "direct";
        }
      } else {
        missing.push(perm);
      }
    }

    return {
      allowed: missing.length === 0,
      reason: missing.length === 0 ? "allowed" : "missing_permission",
      requested,
      missing: missing.length > 0 ? missing : undefined,
      matched: matched.length > 0 ? matched : undefined,
      checkedFrom: missing.length === 0 ? finalCheckedFrom : "none",
    };
  }

  return {
    allowed: false,
    reason: "invalid_request",
  };
}

function checkSinglePermission(
  effectivePermissions: string[],
  directCount: number,
  target: string,
  unknownPermission?: "ignore" | "warn" | "throw",
  registry?: readonly string[],
): AccessDecision {
  const match = findMatch(effectivePermissions, directCount, target);

  if (match) {
    return {
      allowed: true,
      reason: "allowed",
      requested: [target],
      matched: [match.matched],
      checkedFrom: match.checkedFrom,
    };
  }

  // Determine if this permission is genuinely "unknown" to the system.
  // Without a registry we fall back to treating every denial as a
  // potentially unknown permission.
  const isUnknown = registry ? !registry.includes(target) : true;

  if (unknownPermission === "throw" && isUnknown) {
    return {
      allowed: false,
      reason: "unknown_permission",
      requested: [target],
      checkedFrom: "none",
    };
  }

  if (unknownPermission === "warn" && isUnknown) {
    warnOnce(target);
  }

  return {
    allowed: false,
    reason: "missing_permission",
    requested: [target],
    missing: [target],
    checkedFrom: "none",
  };
}

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

/** @internal Reset warning cache (useful for testing). */
export function resetWarnings(): void {
  warnedPermissions.clear();
}
