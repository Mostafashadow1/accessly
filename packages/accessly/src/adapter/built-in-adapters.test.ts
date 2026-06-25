import { describe, it, expect } from "vitest";
import {
  directPermissionsAdapter,
  createActionsAdapter,
  pagesOnlyAdapter,
  nestedModulesAdapter,
  featuresAdapter,
} from "./built-in-adapters";

describe("directPermissionsAdapter", () => {
  it("normalizes flat permissions", () => {
    const result = directPermissionsAdapter({
      permissions: ["users.create", "users.delete"],
      roles: ["admin"],
      flags: ["beta"],
    });
    expect(result.permissions).toEqual(["users.create", "users.delete"]);
    expect(result.user?.roles).toEqual(["admin"]);
    expect(result.flags).toEqual(["beta"]);
  });

  it("handles empty input", () => {
    const result = directPermissionsAdapter({});
    expect(result.permissions).toEqual([]);
    expect(result.flags).toEqual([]);
  });
});

describe("createActionsAdapter", () => {
  it("converts resource-action map to dot notation", () => {
    const result = createActionsAdapter({
      users: ["create", "delete"],
      posts: ["view"],
    });
    expect(result.permissions).toContain("users.create");
    expect(result.permissions).toContain("users.delete");
    expect(result.permissions).toContain("posts.view");
  });

  it("handles empty input", () => {
    const result = createActionsAdapter({});
    expect(result.permissions).toEqual([]);
  });

  it("ignores nil values gracefully", () => {
    const result = createActionsAdapter({
      users: undefined,
    } as any);
    expect(result.permissions).toEqual([]);
  });
});

describe("pagesOnlyAdapter", () => {
  it("prefixes pages with pages.", () => {
    const result = pagesOnlyAdapter({ pages: ["dashboard", "users"] });
    expect(result.permissions).toContain("pages.dashboard");
    expect(result.permissions).toContain("pages.users");
  });

  it("does not double-prefix", () => {
    const result = pagesOnlyAdapter({ pages: ["pages.dashboard"] });
    expect(result.permissions).toEqual(["pages.dashboard"]);
  });

  it("handles empty input", () => {
    const result = pagesOnlyAdapter({});
    expect(result.permissions).toEqual([]);
  });
});

describe("nestedModulesAdapter", () => {
  it("converts nested true fields to permissions", () => {
    const result = nestedModulesAdapter({
      users: { create: true, delete: false, view: true },
    });
    expect(result.permissions).toContain("users.create");
    expect(result.permissions).not.toContain("users.delete");
    expect(result.permissions).toContain("users.view");
  });

  it("handles empty input", () => {
    const result = nestedModulesAdapter({});
    expect(result.permissions).toEqual([]);
  });
});

describe("featuresAdapter", () => {
  it("converts enabled features to flags", () => {
    const result = featuresAdapter({
      features: { "new-dashboard": true, "beta-reports": false },
    });
    expect(result.flags).toContain("features.new-dashboard");
    expect(result.flags).not.toContain("features.beta-reports");
    // Features are flags, not permissions — do not conflate the two
    expect(result.permissions).toBeUndefined();
  });

  it("handles empty input", () => {
    const result = featuresAdapter({});
    expect(result.flags).toEqual([]);
  });
});
