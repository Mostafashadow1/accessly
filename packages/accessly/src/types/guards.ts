import type { AccessAdapter } from "./adapter";
import type { AccessDecision } from "./access-decision";
import type { AccessModel } from "./access-model";
import type { NavigationItem } from "./navigation-item";
import type { PermissionCheckInput } from "./permission-check-input";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isNavigationItem(value: unknown): value is NavigationItem {
  if (!isObject(value)) return false;
  if (typeof value.label !== "string") return false;
  if (value.href !== undefined && typeof value.href !== "string") return false;
  if (
    value.permission !== undefined &&
    typeof value.permission !== "string"
  ) {
    return false;
  }
  if (value.children !== undefined) {
    return (
      Array.isArray(value.children) &&
      value.children.every((child) => isNavigationItem(child))
    );
  }
  return true;
}

export function isAccessModel(value: unknown): value is AccessModel {
  if (!isObject(value)) return false;

  if (value.user !== undefined) {
    if (!isObject(value.user)) return false;
    if (value.user.id !== undefined && typeof value.user.id !== "string") {
      return false;
    }
    if (
      value.user.roles !== undefined &&
      !isStringArray(value.user.roles)
    ) {
      return false;
    }
    if (
      value.user.attributes !== undefined &&
      !isObject(value.user.attributes)
    ) {
      return false;
    }
  }

  if (value.permissions !== undefined && !isStringArray(value.permissions)) {
    return false;
  }
  if (value.flags !== undefined && !isStringArray(value.flags)) {
    return false;
  }
  if (
    value.navigation !== undefined &&
    (!Array.isArray(value.navigation) ||
      !value.navigation.every((item) => isNavigationItem(item)))
  ) {
    return false;
  }
  if (value.isLoading !== undefined && typeof value.isLoading !== "boolean") {
    return false;
  }

  return true;
}

export function isAccessDecision(value: unknown): value is AccessDecision {
  if (!isObject(value)) return false;
  if (typeof value.allowed !== "boolean") return false;
  if (
    ![
      "allowed",
      "missing_permission",
      "missing_flag",
      "unknown_permission",
      "not_ready",
      "invalid_request",
    ].includes(String(value.reason))
  ) {
    return false;
  }
  if (value.requested !== undefined && !isStringArray(value.requested)) {
    return false;
  }
  if (value.missing !== undefined && !isStringArray(value.missing)) {
    return false;
  }
  if (value.matched !== undefined && !isStringArray(value.matched)) {
    return false;
  }
  if (
    value.checkedFrom !== undefined &&
    !["direct", "role", "wildcard", "flag", "none"].includes(
      String(value.checkedFrom),
    )
  ) {
    return false;
  }
  return true;
}

export function isPermissionCheckInput(
  value: unknown,
): value is PermissionCheckInput {
  if (!isObject(value)) return false;
  return (
    typeof value.permission === "string" ||
    isStringArray(value.any) ||
    isStringArray(value.all) ||
    typeof value.flag === "string"
  );
}

export function isAccessAdapter(value: unknown): value is AccessAdapter {
  return isObject(value) && typeof value.normalize === "function";
}
