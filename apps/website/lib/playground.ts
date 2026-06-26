import type { Scenario, BackendData, DecisionResult } from "@/types/playground";

/**
 * Compute a decision result based on the scenario and backend.
 * The scenario toggle is the authoritative source:
 * - "allowed" → always allowed (user explicitly chose to see allowed)
 * - "denied" → always denied
 */
export function getDecision(
  scenario: Scenario,
  _backend: BackendData,
): DecisionResult {
  const allowed = scenario === "allowed";
  return {
    allowed,
    permission: "posts.create",
    reason: allowed ? "matched" : "missing_permission",
    matchedBy: allowed ? "direct permission" : "N/A",
    checkedFrom: "user.permissions",
  };
}
