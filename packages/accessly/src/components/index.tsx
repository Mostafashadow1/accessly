import React from "react";
import type { PermissionCheckInput, AccessDecision } from "../types/access";
import { useAccessDecision } from "../hooks";

type PermissionProp =
  | string
  | PermissionCheckInput;

type ChildrenProp =
  | React.ReactNode
  | ((decision: AccessDecision) => React.ReactNode);

interface CanProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children?: ChildrenProp;
}

interface CannotProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children?: ChildrenProp;
}

interface ProtectedRouteProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children?: ChildrenProp;
}

function renderChildren(
  children: ChildrenProp | undefined,
  decision: AccessDecision,
): React.ReactNode {
  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }
  return <>{children}</>;
}

export function Can({ permission, fallback, loading, children }: CanProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = useAccessDecision(input);

  // Render-prop consumers always get full control
  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (decision.reason === "not_ready") {
    return <>{loading ?? fallback ?? null}</>;
  }

  if (decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}

export function Cannot({ permission, fallback, loading, children }: CannotProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = useAccessDecision(input);

  // Render-prop consumers always get full control
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

export function ProtectedRoute({
  permission,
  fallback,
  loading,
  children,
}: ProtectedRouteProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = useAccessDecision(input);

  // Render-prop consumers always get full control
  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (decision.reason === "not_ready") {
    return <>{loading ?? fallback ?? null}</>;
  }

  if (decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}
