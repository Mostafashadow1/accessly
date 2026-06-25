import type { AccessDecision, AccessModel, PermissionCheckInput, RolePermissions } from "../types/access";
import { checkPermission as engineCheckPermission, isUnknownPermission } from "../engine/check-permission";

export function formatDecision(decision: AccessDecision): string {
  const parts = [
    `Allowed: ${decision.allowed}`,
    `Reason: ${decision.reason}`,
  ];
  if (decision.requested?.length) {
    parts.push(`Requested: ${decision.requested.join(", ")}`);
  }
  if (decision.matched?.length) {
    parts.push(`Matched: ${decision.matched.join(", ")}`);
  }
  if (decision.missing?.length) {
    parts.push(`Missing: ${decision.missing.join(", ")}`);
  }
  if (decision.checkedFrom) {
    parts.push(`Checked from: ${decision.checkedFrom}`);
  }
  return parts.join("\n");
}

export function inspectAccess(model: AccessModel | null): string {
  if (!model) return "No access model available.";
  const lines: string[] = [];
  if (model.user?.id) lines.push(`User: ${model.user.id}`);
  if (model.user?.roles?.length) {
    lines.push(`Roles: ${model.user.roles.join(", ")}`);
  }
  if (model.permissions?.length) {
    lines.push(`Permissions (${model.permissions.length}):`);
    for (const p of model.permissions) {
      lines.push(`  - ${p}`);
    }
  }
  if (model.flags?.length) {
    lines.push(`Flags (${model.flags.length}):`);
    for (const f of model.flags) {
      lines.push(`  - ${f}`);
    }
  }
  if (model.isLoading) {
    lines.push("Status: loading");
  }
  return lines.join("\n");
}

// ── Unknown-permission warning wrapper ─────────────────────────────
// The engine itself is pure and does not warn.  This wrapper adds
// development-time warnings when unknownPermission is "warn".

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
