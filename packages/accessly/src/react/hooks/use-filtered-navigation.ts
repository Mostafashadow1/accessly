import { useMemo } from "react";
import type { AccessModel, NavigationItem } from "../../types";
import { filterNavigation } from "../../navigation";

export function useFilteredNavigation(
  items: NavigationItem[],
  model: AccessModel | null,
): NavigationItem[] {
  return useMemo(() => filterNavigation(items, model), [items, model]);
}
