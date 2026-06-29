import type { AccessModel } from "./access-model";

export type AccessAdapter<TSource = unknown> = {
  normalize: (source: TSource) => AccessModel;
};
