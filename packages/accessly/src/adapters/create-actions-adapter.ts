import type { AccessModel } from "../types";

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
