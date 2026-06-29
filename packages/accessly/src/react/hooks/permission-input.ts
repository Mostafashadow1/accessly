import type { PermissionCheckInput } from "../../types";

export function stabilizeInput(
  input: string | PermissionCheckInput,
): PermissionCheckInput {
  if (typeof input === "string") return { permission: input };
  return input;
}

export function inputKey(input: PermissionCheckInput): string {
  if ("permission" in input) return `p:${input.permission}`;
  if ("any" in input) return `any:${input.any.join(",")}`;
  if ("all" in input) return `all:${input.all.join(",")}`;
  if ("flag" in input) return `f:${input.flag}`;
  return "invalid";
}
