/* ── Accessly Lab Types ── */

export type LabMode = "playground" | "inspector";

export type BackendId =
  | "laravel"
  | "nestjs"
  | "aspnet"
  | "springboot"
  | "supabase"
  | "express"
  | "custom";

export interface BackendPreset {
  id: BackendId;
  name: string;
  description: string;
  icon: string;
  color: string;
  payload: Record<string, unknown>;
  adapterCode: string;
  permissions: string[];
  roles: string[];
}

export interface ReplayStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  timing: string;
}

export interface LabDecision {
  granted: boolean;
  permission: string;
  title: string;
  explanation: string;
  details: {
    requestedPermission: string;
    role?: string;
    grantedBy?: string;
    matchedPermission: string;
    wildcardMatched?: string;
    source: string;
    notFoundInRaw: boolean;
    notFoundInRoleExpanded: boolean;
    notMatchedByWildcard: boolean;
  };
  effectivePermissions: {
    raw: string[];
    roleExpanded: {
      role: string;
      permission: string;
      grantedBy: string;
    }[];
    final: string[];
    flags: string[];
    roles: string[];
  };
  pipelineLabel: string;
  matched: string;
  source: "direct" | "role_expansion" | "wildcard" | "missing";
  direct: boolean;
  wildcardMatch: boolean;
  wildcards: string[];
  timing: number;
}

export type PermissionSourceBadge = "Raw" | "Role" | "Wildcard" | "Missing" | "Flag";

export interface JsonValidationResult {
  valid: boolean;
  error: string | null;
  data: Record<string, unknown> | null;
}

export interface LabCopyAction {
  label: string;
  value: string;
  icon: string;
}
