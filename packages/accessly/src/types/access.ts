export type AccessModel = {
  user?: {
    id?: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
  };
  permissions?: string[];
  flags?: string[];
  navigation?: NavigationItem[];
  isLoading?: boolean;
};

export type NavigationItem = {
  label: string;
  href?: string;
  permission?: string;
  children?: NavigationItem[];
};

export type AccessDecision = {
  allowed: boolean;
  reason:
    | "allowed"
    | "missing_permission"
    | "missing_flag"
    | "unknown_permission"
    | "not_ready"
    | "invalid_request";
  requested?: string[];
  missing?: string[];
  matched?: string[];
  checkedFrom?: "direct" | "role" | "wildcard" | "flag" | "none";
};

export type RolePermissions = Record<string, string[]>;

export type PermissionCheckInput =
  | { permission: string }
  | { any: string[] }
  | { all: string[] }
  | { flag: string };

export type AccessAdapter<TSource = unknown> = {
  normalize: (source: TSource) => AccessModel;
};
