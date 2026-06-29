import { useMemo } from "react";
import type { AccessDecision, PermissionCheckInput } from "../../types";
import { checkPermission } from "../../engine";
import { useAccessContext } from "../provider";
import { getAccessContextModel } from "./access-context-model";
import { inputKey, stabilizeInput } from "./permission-input";

export function useAccessDecision(
  input: string | PermissionCheckInput,
): AccessDecision {
  const ctx = useAccessContext();

  const checkInput = stabilizeInput(input);
  const key = inputKey(checkInput);

  return useMemo(
    () =>
      checkPermission(getAccessContextModel(ctx), checkInput, {
        rolePermissions: ctx.rolePermissions,
        registry: ctx.registry,
        unknownPermission: ctx.unknownPermission,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      ctx.model,
      ctx.loading,
      ctx.rolePermissions,
      ctx.registry,
      ctx.unknownPermission,
      key,
    ],
  );
}
