import { describe, it, expect, beforeEach } from "vitest";
import { formatDecision, inspectAccess, checkPermission, resetWarnings } from "./index";
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

describe("checkPermission (debug wrapper)", () => {
  beforeEach(() => {
    resetWarnings();
  });

  it("warns when unknownPermission is warn and permission not in registry", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    const result = checkPermission(
      model,
      { permission: "unknown.perm" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("missing_permission");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Unknown permission"),
    );
    spy.mockRestore();
  });

  it("does not warn for permissions in the registry", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    checkPermission(
      model,
      { permission: "known.perm" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("deduplicates warnings", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    checkPermission(
      model,
      { permission: "dup.perm" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    checkPermission(
      model,
      { permission: "dup.perm" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("does not warn when permission is in user's effective permissions", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: ["users.create"] };
    checkPermission(
      model,
      { permission: "users.create" },
      { unknownPermission: "warn", registry: ["users.create"] },
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("warns for each unknown permission in any", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    const result = checkPermission(
      model,
      { any: ["unknown.perm", "also.unknown"] },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("missing_permission");
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it("warns for unknown permissions in all", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    const result = checkPermission(
      model,
      { all: ["unknown.perm"] },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("missing_permission");
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("does not warn when unknownPermission is ignore", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };
    checkPermission(
      model,
      { permission: "unknown.perm" },
      { unknownPermission: "ignore", registry: ["known.perm"] },
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("resetWarnings clears the deduplication cache", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const model: AccessModel = { permissions: [] };

    // First call warns
    checkPermission(
      model,
      { permission: "warn.me" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(spy).toHaveBeenCalledTimes(1);

    // Reset
    resetWarnings();

    // Second call should warn again (cache was cleared)
    checkPermission(
      model,
      { permission: "warn.me" },
      { unknownPermission: "warn", registry: ["known.perm"] },
    );
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });
});
