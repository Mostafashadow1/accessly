import type { PermissionComponentProps } from "./types";
import { useAccessDecision } from "../hooks";
import { normalizePermission } from "./normalize-permission";

export function Cannot({
  permission,
  fallback,
  loading,
  children,
}: PermissionComponentProps) {
  const input = normalizePermission(permission);
  const decision = useAccessDecision(input);

  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (decision.reason === "not_ready") {
    return <>{loading ?? fallback ?? null}</>;
  }

  if (!decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}
