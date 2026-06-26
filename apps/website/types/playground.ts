/* ── Playground Types ── */

export type Scenario = "allowed" | "denied";

export type PanelStatus = "idle" | "pending" | "loading" | "active" | "settled";

export interface BackendData {
  id: string;
  label: string;
  hasPermission: boolean;
  response: string;
  adapter: string;
  model: string;
}

export interface LogEntry {
  id: number;
  message: string;
  emoji: string;
}

export interface DecisionResult {
  allowed: boolean;
  permission: string;
  reason: string;
  matchedBy: string;
  checkedFrom: string;
}

export interface StepDef {
  key: string;
  num: string;
  label: string;
  accentIdle: string;
  accentActive: string;
}
