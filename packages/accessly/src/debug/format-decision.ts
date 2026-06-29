import type { AccessDecision } from "../types";

export function formatDecision(decision: AccessDecision): string {
  const parts = [
    `Allowed: ${decision.allowed}`,
    `Reason: ${decision.reason}`,
  ];
  if (decision.requested?.length) {
    parts.push(`Requested: ${decision.requested.join(", ")}`);
  }
  if (decision.matched?.length) {
    parts.push(`Matched: ${decision.matched.join(", ")}`);
  }
  if (decision.missing?.length) {
    parts.push(`Missing: ${decision.missing.join(", ")}`);
  }
  if (decision.checkedFrom) {
    parts.push(`Checked from: ${decision.checkedFrom}`);
  }
  return parts.join("\n");
}
