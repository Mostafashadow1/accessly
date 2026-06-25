import React from "react";
import type { PermissionCheckInput, AccessDecision } from "../types/access";
import { usePermissionResult } from "../hooks";

type PermissionProp =
  | string
  | PermissionCheckInput;

type ChildrenProp =
  | React.ReactNode
  | ((decision: AccessDecision) => React.ReactNode);

interface CanProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  children?: ChildrenProp;
}

interface CannotProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  children?: ChildrenProp;
}

interface ProtectedRouteProps {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  children?: ChildrenProp;
}

export function Can({ permission, fallback, children }: CanProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = usePermissionResult(input);

  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}

export function Cannot({ permission, fallback, children }: CannotProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = usePermissionResult(input);

  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (!decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}

export function ProtectedRoute({
  permission,
  fallback,
  children,
}: ProtectedRouteProps) {
  const input: PermissionCheckInput =
    typeof permission === "string" ? { permission } : permission;
  const decision = usePermissionResult(input);

  if (typeof children === "function") {
    return <>{children(decision)}</>;
  }

  if (decision.allowed) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}
