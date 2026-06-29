import type { AccessAdapter, AccessModel } from "../types";

export function createAdapter<TSource>(
  normalize: (source: TSource) => AccessModel,
): AccessAdapter<TSource> {
  return { normalize };
}
