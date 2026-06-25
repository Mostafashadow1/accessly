import type { AccessModel, NavigationItem } from "../types/access";

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

/** Adapter for backends that group actions under resource keys. */
export function createActionsAdapter(
  source: Partial<Record<string, string[]>>,
): AccessModel {
  const permissions: string[] = [];
  for (const [resource, actions] of Object.entries(source)) {
    if (Array.isArray(actions)) {
      for (const action of actions) {
        permissions.push(`${resource}.${action}`);
      }
    }
  }
  return { permissions };
}

/** Adapter for backends that only expose page/route access. */
export function pagesOnlyAdapter(
  source: { pages?: string[] },
): AccessModel {
  return {
    permissions: (source.pages ?? []).map((p) =>
      p.startsWith("pages.") ? p : `pages.${p}`,
    ),
  };
}

/** Adapter for nested module structures. */
export function nestedModulesAdapter(
  source: Record<string, Record<string, boolean>>,
): AccessModel {
  const permissions: string[] = [];
  for (const [module, actions] of Object.entries(source)) {
    if (actions && typeof actions === "object") {
      for (const [action, allowed] of Object.entries(actions)) {
        if (allowed === true) {
          permissions.push(`${module}.${action}`);
        }
      }
    }
  }
  return { permissions };
}

/** Adapter for feature flag backends. */
export function featuresAdapter(
  source: { features?: Record<string, boolean> },
): AccessModel {
  const flags: string[] = [];
  if (source.features) {
    for (const [key, enabled] of Object.entries(source.features)) {
      if (enabled) {
        flags.push(`features.${key}`);
      }
    }
  }
  return { flags };
}
