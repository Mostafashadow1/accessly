import type { AccessDecision, PermissionCheckInput } from "accessly";

/* ── Example Category ─────────────────────────────────────────────── */

export type ExampleCategoryId =
  | "admin-dashboard"
  | "saas-dashboard"
  | "cms"
  | "crm"
  | "ecommerce"
  | "hr-system"
  | "github-app"
  | "billing-plans"
  | "team-management"
  | "feature-flags";

export interface ExampleCategory {
  id: ExampleCategoryId;
  label: string;
  description: string;
  icon: string;
}

/* ── Role / Plan Configuration ────────────────────────────────────── */

export interface RoleConfig {
  id: string;
  label: string;
  description: string;
  permissions: string[];
  flags?: string[];
}

export interface PlanConfig {
  id: string;
  label: string;
  description: string;
  permissions: string[];
  flags: string[];
}

/* ── Example Data ─────────────────────────────────────────────────── */

export interface ExampleConfig {
  id: ExampleCategoryId;
  title: string;
  description: string;
  icon: string;
  apisTested: string[];
  rolesOrPlans: RoleConfig[] | PlanConfig[];
  usePlans: boolean;
  defaultRoleOrPlan: string;
  defaultPermissions: string[];
  defaultFlags?: string[];
  allPermissions: string[];
  allFlags?: string[];
  codeSnippet: string;
  codeExplanation: string;
}

/* ── Permission Display ───────────────────────────────────────────── */

export interface PermissionDisplay {
  id: string;
  label: string;
  description: string;
}
