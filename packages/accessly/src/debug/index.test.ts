import { describe, it, expect } from "vitest";
import { formatDecision, inspectAccess } from "./index";
import type { AccessDecision, AccessModel } from "../types/access";

describe("formatDecision", () => {
  it("formats an allowed decision", () => {
    const decision: AccessDecision = {
      allowed: true,
      reason: "allowed",
      requested: ["users.create"],
      matched: ["users.create"],
      checkedFrom: "direct",
    };
    const output = formatDecision(decision);
    expect(output).toContain("Allowed: true");
    expect(output).toContain("Reason: allowed");
    expect(output).toContain("Matched: users.create");
  });

  it("formats a denied decision", () => {
    const decision: AccessDecision = {
      allowed: false,
      reason: "missing_permission",
      requested: ["users.edit"],
      missing: ["users.edit"],
      checkedFrom: "none",
    };
    const output = formatDecision(decision);
    expect(output).toContain("Allowed: false");
    expect(output).toContain("Missing: users.edit");
  });

  it("formats an unknown_permission decision", () => {
    const decision: AccessDecision = {
      allowed: false,
      reason: "unknown_permission",
      requested: ["unknown.perm"],
      checkedFrom: "none",
    };
    const output = formatDecision(decision);
    expect(output).toContain("Allowed: false");
    expect(output).toContain("Reason: unknown_permission");
    expect(output).not.toContain("Missing:");
  });

  it("formats a not_ready decision", () => {
    const decision: AccessDecision = {
      allowed: false,
      reason: "not_ready",
    };
    const output = formatDecision(decision);
    expect(output).toContain("Allowed: false");
    expect(output).toContain("Reason: not_ready");
  });

  it("formats a flag decision", () => {
    const decision: AccessDecision = {
      allowed: true,
      reason: "allowed",
      requested: ["features.beta"],
      matched: ["features.beta"],
      checkedFrom: "flag",
    };
    const output = formatDecision(decision);
    expect(output).toContain("Allowed: true");
    expect(output).toContain("Checked from: flag");
  });
});

describe("inspectAccess", () => {
  it("returns details for a complete model", () => {
    const model: AccessModel = {
      user: { id: "1", roles: ["admin"] },
      permissions: ["users.create"],
      flags: ["feature-a"],
    };
    const output = inspectAccess(model);
    expect(output).toContain("User: 1");
    expect(output).toContain("Roles: admin");
    expect(output).toContain("Permissions (1)");
    expect(output).toContain("Flags (1)");
  });

  it("returns message for null model", () => {
    expect(inspectAccess(null)).toBe("No access model available.");
  });

  it("shows loading status", () => {
    const model: AccessModel = { isLoading: true };
    const output = inspectAccess(model);
    expect(output).toContain("loading");
  });

  it("shows user without roles", () => {
    const model: AccessModel = {
      user: { id: "42" },
      permissions: ["test.perm"],
    };
    const output = inspectAccess(model);
    expect(output).toContain("User: 42");
    expect(output).not.toContain("Roles:");
  });
});
