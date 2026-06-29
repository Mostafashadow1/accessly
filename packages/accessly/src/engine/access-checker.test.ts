import { describe, expect, it } from "vitest";
import { createAccessChecker } from "./access-checker";

describe("createAccessChecker", () => {
  it("checks string permissions", () => {
    const checker = createAccessChecker({
      permissions: ["users.create"],
    });

    expect(checker.can("users.create")).toBe(true);
    expect(checker.can("users.delete")).toBe(false);
  });

  it("returns full decisions", () => {
    const checker = createAccessChecker({
      permissions: ["reports.*"],
    });

    const decision = checker.decision("reports.export");

    expect(decision.allowed).toBe(true);
    expect(decision.matched).toEqual(["reports.*"]);
    expect(decision.checkedFrom).toBe("wildcard");
  });

  it("supports all PermissionCheckInput forms", () => {
    const checker = createAccessChecker({
      permissions: ["users.create", "reports.view", "reports.export"],
      flags: ["features.beta"],
    });

    expect(checker.can({ permission: "users.create" })).toBe(true);
    expect(checker.can({ any: ["users.invite", "users.create"] })).toBe(true);
    expect(checker.can({ all: ["reports.view", "reports.export"] })).toBe(
      true,
    );
    expect(checker.can({ flag: "features.beta" })).toBe(true);
  });

  it("passes options through to checkPermission", () => {
    const checker = createAccessChecker(
      {
        user: { roles: ["admin"] },
        permissions: [],
      },
      {
        rolePermissions: {
          admin: ["users.*"],
        },
      },
    );

    expect(checker.decision("users.delete").checkedFrom).toBe("role");
  });

  it("preserves not_ready behavior", () => {
    const checker = createAccessChecker(null);

    expect(checker.decision("users.create")).toEqual({
      allowed: false,
      reason: "not_ready",
    });
  });
});
