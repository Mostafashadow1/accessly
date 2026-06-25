import { useMemo } from "react";
import type { NavigationItem, AccessModel } from "../types/access";
import { checkPermission } from "../engine/check-permission";

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
      if (filteredChildren.length === 0 && item.permission) return acc;
      acc.push({ ...item, children: filteredChildren });
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);
}

export function useFilteredNavigation(
  items: NavigationItem[],
  model: AccessModel | null,
): NavigationItem[] {
  return useMemo(() => filterNavigation(items, model), [items, model]);
}
