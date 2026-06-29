import type { AccessModel } from "../../types";

const LOADING_MODEL: AccessModel = { isLoading: true };

export function getAccessContextModel(ctx: {
  model: AccessModel | null;
  loading: boolean;
}): AccessModel | null {
  if (ctx.loading) return LOADING_MODEL;
  return ctx.model;
}
