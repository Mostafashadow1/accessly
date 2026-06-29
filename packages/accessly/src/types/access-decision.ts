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
