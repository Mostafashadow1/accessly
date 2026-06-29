import type { PermissionCheckInput } from "../../types";
import { useAccessDecision } from "./use-access-decision";

export function usePermission(input: string | PermissionCheckInput): boolean {
  const result = useAccessDecision(input);
  return result.allowed;
}
