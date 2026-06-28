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
  explanation: string;
  matched: string;
  source: string;
  direct: boolean;
  wildcardMatch: boolean;
  wildcards: string[];
  timing: number;
}

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
