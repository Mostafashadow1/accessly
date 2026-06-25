import { useMemo } from "react";
import type { PermissionCheckInput, AccessDecision, AccessModel } from "../types/access";
import { checkPermission } from "../debug";
import { useAccessContext } from "../provider";

const LOADING_MODEL: AccessModel = { isLoading: true };

function getModel(ctx: {
  model: AccessModel | null;
  loading: boolean;
}): AccessModel | null {
  if (ctx.loading) return LOADING_MODEL;
  return ctx.model;
}

/**
 * Stabilise an object-typed permission input so it doesn't
 * break useMemo deps by changing reference every render.
 */
function stabilizeInput(input: string | PermissionCheckInput): PermissionCheckInput {
  if (typeof input === "string") return { permission: input };
  return input;
}

function inputKey(input: PermissionCheckInput): string {
  if ("permission" in input) return `p:${input.permission}`;
  if ("any" in input) return `any:${input.any.join(",")}`;
  if ("all" in input) return `all:${input.all.join(",")}`;
  if ("flag" in input) return `f:${input.flag}`;
  return "invalid";
}

export function useAccessModel(): AccessModel | null {
  const ctx = useAccessContext();
  return getModel(ctx);
}

export function usePermission(
  input: string | PermissionCheckInput,
): boolean {
  const result = useAccessDecision(input);
  return result.allowed;
}

export function useAccessDecision(
  input: string | PermissionCheckInput,
): AccessDecision {
  const ctx = useAccessContext();

  const checkInput = stabilizeInput(input);
  const key = inputKey(checkInput);

  return useMemo(
    () =>
      checkPermission(
        getModel(ctx),
        checkInput,
        {
          rolePermissions: ctx.rolePermissions,
          registry: ctx.registry,
          unknownPermission: ctx.unknownPermission,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctx.model, ctx.loading, ctx.rolePermissions, ctx.registry, ctx.unknownPermission, key],
  );
}
