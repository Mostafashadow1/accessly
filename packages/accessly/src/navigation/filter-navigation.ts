import type { AccessModel, NavigationItem } from "../types";
import { checkPermission } from "../engine";

export function filterNavigation(
  items: NavigationItem[],
  model: AccessModel | null,
): NavigationItem[] {
  if (!model) return [];

  return items.reduce<NavigationItem[]>((acc, item) => {
    if (item.permission) {
      const decision = checkPermission(model, { permission: item.permission });
      if (!decision.allowed) return acc;
    }

    if (item.children) {
      const filteredChildren = filterNavigation(item.children, model);
      // Skip parent if all children were filtered out (regardless of
      // whether the parent itself carries a permission)
      if (filteredChildren.length === 0) return acc;
      acc.push({ ...item, children: filteredChildren });
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);
}
