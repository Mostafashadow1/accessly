import type { AccessModel } from "../types";

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
