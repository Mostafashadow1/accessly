import type { AccessModel } from "../types";

/** Adapter for backends that only expose page/route access. */
export function pagesOnlyAdapter(source: { pages?: string[] }): AccessModel {
  return {
    permissions: (source.pages ?? []).map((p) =>
      p.startsWith("pages.") ? p : `pages.${p}`,
    ),
  };
}
