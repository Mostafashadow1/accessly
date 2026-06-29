import { describe, expect, it } from "vitest";
import { computeLabDecision } from "./lab-decision";

describe("Accessly Lab decision helpers", () => {
  it("allows raw backend permissions directly", () => {
    const decision = computeLabDecision(
      "repositories.read",
      { permissions: ["repositories.read"], user: { roles: [] } },
      "custom",
    );

    expect(decision.granted).toBe(true);
    expect(decision.source).toBe("direct");
    expect(decision.title).toBe("Allowed by direct permission");
  });

  it("allows permissions expanded from roles", () => {
    const decision = computeLabDecision(
      "posts.write",
      { permissions: ["repositories.read"], user: { roles: ["editor"] } },
      "custom",
    );

    expect(decision.granted).toBe(true);
    expect(decision.source).toBe("role_expansion");
    expect(decision.details.role).toBe("editor");
    expect(decision.details.grantedBy).toBe("rolePermissions.editor");
  });

  it("allows segment-based wildcard permissions", () => {
    const decision = computeLabDecision(
      "users.create",
      { permissions: ["users.*"], user: { roles: [] } },
      "custom",
    );

    expect(decision.granted).toBe(true);
    expect(decision.source).toBe("wildcard");
    expect(decision.details.wildcardMatched).toBe("users.*");
  });

  it("denies missing permissions", () => {
    const decision = computeLabDecision(
      "billing.manage",
      { permissions: ["billing.view"], user: { roles: [] } },
      "custom",
    );

    expect(decision.granted).toBe(false);
    expect(decision.source).toBe("missing");
    expect(decision.title).toBe("Denied: missing permission");
  });

  it("updates when a permission is removed from JSON", () => {
    const before = computeLabDecision(
      "repositories.write",
      { permissions: ["repositories.write"], user: { roles: [] } },
      "custom",
    );
    const after = computeLabDecision(
      "repositories.write",
      { permissions: [], user: { roles: [] } },
      "custom",
    );

    expect(before.granted).toBe(true);
    expect(after.granted).toBe(false);
    expect(after.source).toBe("missing");
  });

  it("updates when the selected permission changes", () => {
    const payload = {
      permissions: ["repositories.read"],
      user: { roles: ["editor"] },
    };

    const rawDecision = computeLabDecision("repositories.read", payload, "custom");
    const roleDecision = computeLabDecision("posts.write", payload, "custom");

    expect(rawDecision.source).toBe("direct");
    expect(roleDecision.source).toBe("role_expansion");
  });
});
