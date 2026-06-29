import type React from "react";
import type { AccessDecision, PermissionCheckInput } from "../../types";

export type PermissionProp = string | PermissionCheckInput;

export type ChildrenProp =
  | React.ReactNode
  | ((decision: AccessDecision) => React.ReactNode);

export type PermissionComponentProps = {
  permission: PermissionProp;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children?: ChildrenProp;
};
