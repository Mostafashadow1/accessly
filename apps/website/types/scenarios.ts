import type { AccessDecision, AccessModel, PermissionCheckInput } from "accessly";

export type ScenarioRole = {
  name: string;
  description: string;
};

export type ScenarioCheck = {
  label: string;
  api: string;
  input: PermissionCheckInput;
  expected: Pick<AccessDecision, "allowed" | "reason" | "checkedFrom">;
};

export type ScenarioPreviewItem = {
  label: string;
  state: "visible" | "hidden" | "disabled";
  note: string;
};

export type AccesslyScenario = {
  name: string;
  summary: string;
  roles: ScenarioRole[];
  permissions: string[];
  flags: string[];
  accessModel: AccessModel;
  checks: ScenarioCheck[];
  preview: ScenarioPreviewItem[];
  codeSnippet: string;
};
