import type {
  AccessDecision,
  AccessModel,
  PermissionCheckInput,
  RolePermissions,
} from "../types";
import { checkPermission } from "./check-permission";

type AccessCheckerInput = string | PermissionCheckInput;

type AccessCheckerOptions = {
  rolePermissions?: RolePermissions;
  unknownPermission?: "ignore" | "warn" | "throw";
  registry?: readonly string[];
};

function normalizeInput(input: AccessCheckerInput): PermissionCheckInput {
  if (typeof input === "string") return { permission: input };
  return input;
}

export function createAccessChecker(
  model: AccessModel | null | undefined,
  options?: AccessCheckerOptions,
) {
  return {
    can(input: AccessCheckerInput): boolean {
      return checkPermission(model, normalizeInput(input), options).allowed;
    },
    decision(input: AccessCheckerInput): AccessDecision {
      return checkPermission(model, normalizeInput(input), options);
    },
  };
}
