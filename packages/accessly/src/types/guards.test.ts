import { describe, expect, it } from "vitest";
import {
  isAccessAdapter,
  isAccessDecision,
  isAccessModel,
  isNavigationItem,
  isPermissionCheckInput,
} from "./guards";

describe("type guards", () => {
  describe("isAccessModel", () => {
    it("accepts practical access model shapes", () => {
      expect(
        isAccessModel({
          user: { id: "user_1", roles: ["admin"], attributes: { tier: "pro" } },
          permissions: ["users.create"],
          flags: ["features.beta"],
          navigation: [{ label: "Users", permission: "users.view" }],
          isLoading: false,
        }),
      ).toBe(true);
    });

    it("rejects invalid model fields", () => {
      expect(isAccessModel({ permissions: "users.create" })).toBe(false);
      expect(isAccessModel({ user: { roles: ["admin", 1] } })).toBe(false);
      expect(isAccessModel({ isLoading: "false" })).toBe(false);
    });
  });

  describe("isAccessDecision", () => {
    it("accepts decision shapes", () => {
      expect(
        isAccessDecision({
          allowed: false,
          reason: "missing_permission",
          requested: ["users.delete"],
          missing: ["users.delete"],
          checkedFrom: "none",
        }),
      ).toBe(true);
    });

    it("rejects invalid decision shapes", () => {
      expect(isAccessDecision({ allowed: "no", reason: "allowed" })).toBe(
        false,
      );
      expect(isAccessDecision({ allowed: false, reason: "nope" })).toBe(false);
      expect(
        isAccessDecision({ allowed: false, reason: "not_ready", missing: [1] }),
      ).toBe(false);
    });
  });

  describe("isPermissionCheckInput", () => {
    it("accepts valid check inputs", () => {
      expect(isPermissionCheckInput({ permission: "users.create" })).toBe(true);
      expect(isPermissionCheckInput({ any: ["users.create"] })).toBe(true);
      expect(isPermissionCheckInput({ all: ["reports.view"] })).toBe(true);
      expect(isPermissionCheckInput({ flag: "features.beta" })).toBe(true);
    });

    it("rejects invalid check inputs", () => {
      expect(isPermissionCheckInput({ permissions: "users.create" })).toBe(
        false,
      );
      expect(isPermissionCheckInput({ any: "users.create" })).toBe(false);
      expect(isPermissionCheckInput({ flag: 123 })).toBe(false);
    });
  });

  describe("isNavigationItem", () => {
    it("accepts nested navigation items", () => {
      expect(
        isNavigationItem({
          label: "Admin",
          children: [{ label: "Users", href: "/users" }],
        }),
      ).toBe(true);
    });

    it("rejects invalid navigation items", () => {
      expect(isNavigationItem({ href: "/users" })).toBe(false);
      expect(isNavigationItem({ label: "Users", children: [{ href: "/" }] }))
        .toBe(false);
    });
  });

  describe("isAccessAdapter", () => {
    it("accepts adapter-like objects", () => {
      expect(isAccessAdapter({ normalize: () => ({ permissions: [] }) })).toBe(
        true,
      );
    });

    it("rejects non-adapters", () => {
      expect(isAccessAdapter({ normalize: "nope" })).toBe(false);
      expect(isAccessAdapter(null)).toBe(false);
    });
  });
});
