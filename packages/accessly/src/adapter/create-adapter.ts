import type { AccessAdapter, AccessModel } from "../types/access";

export function createAdapter<TSource>(
  normalize: (source: TSource) => AccessModel,
): AccessAdapter<TSource> {
  return { normalize };
}
