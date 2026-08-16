import { useMemo } from "react";
import type { PermissionCheckInput } from "../../types";
import { checkPermission } from "../../engine";
import { useAccessContext } from "../provider";
import { getAccessContextModel } from "./access-context-model";
import { inputKey, stabilizeInput } from "./permission-input";

export type BatchPermissionsInput = Record<string, string | PermissionCheckInput>;

export type BatchPermissionsResult<T extends BatchPermissionsInput> = {
  [K in keyof T]: boolean;
};

export function usePermissions<T extends BatchPermissionsInput>(
  inputs: T,
): BatchPermissionsResult<T> {
  const ctx = useAccessContext();

  const keys = Object.keys(inputs);
  const cacheKey = keys
    .map((k) => `${k}=${inputKey(stabilizeInput(inputs[k]))}`)
    .join(";");

  return useMemo(() => {
    const model = getAccessContextModel(ctx);
    const options = {
      rolePermissions: ctx.rolePermissions,
      registry: ctx.registry,
      unknownPermission: ctx.unknownPermission,
    };

    const result = {} as BatchPermissionsResult<T>;
    for (const key of Object.keys(inputs) as (keyof T)[]) {
      const checkInput = stabilizeInput(inputs[key]);
      result[key] = checkPermission(model, checkInput, options).allowed as BatchPermissionsResult<T>[typeof key];
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctx.model,
    ctx.loading,
    ctx.rolePermissions,
    ctx.registry,
    ctx.unknownPermission,
    cacheKey,
  ]);
}
