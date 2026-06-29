import { describe, it, expect } from "vitest";
import { checkPermission } from "./check-permission";
import type { AccessModel } from "../types";

const baseModel: AccessModel = {
  permissions: ["users.create", "users.delete", "reports.export"],
  flags: ["features.new-dashboard"],
  user: {
    roles: ["admin"],
  },
};

describe("checkPermission", () => {
  describe("null/loading model", () => {
    it("returns not_ready for null model", () => {
      const result = checkPermission(null, { permission: "users.create" });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("not_ready");
    });

    it("returns not_ready for undefined model", () => {
      const result = checkPermission(undefined, { permission: "users.create" });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("not_ready");
    });

    it("returns not_ready for loading model", () => {
      const result = checkPermission(
        { isLoading: true },
        { permission: "users.create" },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("not_ready");
    });
  });

  describe("single permission check", () => {
    it("allows an exact permission match", () => {
      const result = checkPermission(baseModel, { permission: "users.create" });
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
      expect(result.matched).toEqual(["users.create"]);
      expect(result.checkedFrom).toBe("direct");
    });

    it("denies a missing permission", () => {
      const result = checkPermission(baseModel, { permission: "users.edit" });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
      expect(result.missing).toEqual(["users.edit"]);
    });

    it("matches via wildcard permission", () => {
      const model: AccessModel = { permissions: ["users.*"] };
      const result = checkPermission(model, { permission: "users.create" });
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
      expect(result.matched).toEqual(["users.*"]);
      expect(result.checkedFrom).toBe("wildcard");
    });

    it("returns invalid_request for empty object", () => {
      const result = checkPermission(baseModel, {} as any);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("invalid_request");
    });
  });

  describe("any check", () => {
    it("allows when any permission matches", () => {
      const result = checkPermission(baseModel, {
        any: ["users.create", "users.edit"],
      });
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
      expect(result.matched).toEqual(["users.create"]);
    });

    it("denies when no permission matches", () => {
      const result = checkPermission(baseModel, {
        any: ["users.edit", "posts.create"],
      });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
      expect(result.missing).toEqual(["users.edit", "posts.create"]);
    });

    it("reports matched permission correctly", () => {
      const result = checkPermission(baseModel, {
        any: ["users.edit", "users.delete"],
      });
      expect(result.allowed).toBe(true);
      expect(result.matched).toEqual(["users.delete"]);
    });
  });

  describe("all check", () => {
    it("allows when all permissions match", () => {
      const result = checkPermission(baseModel, {
        all: ["users.create", "users.delete"],
      });
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
    });

    it("denies when any permission is missing", () => {
      const result = checkPermission(baseModel, {
        all: ["users.create", "users.edit"],
      });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
      expect(result.missing).toEqual(["users.edit"]);
    });
  });

  describe("flag check", () => {
    it("allows when flag exists", () => {
      const result = checkPermission(baseModel, {
        flag: "features.new-dashboard",
      });
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
      expect(result.checkedFrom).toBe("flag");
    });

    it("denies when flag is missing", () => {
      const result = checkPermission(baseModel, {
        flag: "features.beta",
      });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_flag");
      expect(result.missing).toEqual(["features.beta"]);
    });
  });

  describe("role permissions expansion", () => {
    it("expands role permissions and matches", () => {
      const model: AccessModel = {
        user: { roles: ["admin"] },
        permissions: [],
      };
      const result = checkPermission(
        model,
        { permission: "settings.view" },
        {
          rolePermissions: {
            admin: ["settings.view", "settings.edit"],
          },
        },
      );
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
    });

    it("still works without roles", () => {
      const model: AccessModel = { permissions: ["users.create"] };
      const result = checkPermission(
        model,
        { permission: "users.create" },
        {
          rolePermissions: { admin: ["other.perm"] },
        },
      );
      expect(result.allowed).toBe(true);
    });

    it("matches role-based wildcard permission", () => {
      const model: AccessModel = {
        user: { roles: ["editor"] },
        permissions: [],
      };
      const result = checkPermission(
        model,
        { permission: "content.edit" },
        {
          rolePermissions: {
            editor: ["content.*"],
          },
        },
      );
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
      expect(result.matched).toEqual(["content.*"]);
      expect(result.checkedFrom).toBe("role");
    });
  });

  describe("unknown permission strategy with single permission", () => {
    it("returns unknown_permission when throw and permission not in registry", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "throw", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("unknown_permission");
    });

    it("returns unknown_permission when throw even without registry", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { permission: "missing.perm" },
        { unknownPermission: "throw" },
      );
      // Without a registry all missing permissions are treated as unknown.
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("unknown_permission");
    });

    it("does not throw when unknownPermission is ignore", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "ignore", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
    });

    it("returns missing_permission when unknownPermission is warn", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
    });
  });

  describe("unknown permission strategy with any", () => {
    it("throws unknown_permission when any item is unknown and strategy is throw", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { any: ["unknown.perm"] },
        { unknownPermission: "throw", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("unknown_permission");
    });

    it("allows in any if one matches even if others are unknown (throw)", () => {
      const model: AccessModel = { permissions: ["known.create"] };
      const result = checkPermission(
        model,
        { any: ["known.create", "unknown.perm"] },
        { unknownPermission: "throw", registry: ["known.perm", "known.create"] },
      );
      // known.create matches, so we never evaluate unknown.perm
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("allowed");
    });

    it("returns missing_permission for any when strategy is warn", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { any: ["unknown.perm", "also.unknown"] },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
    });
  });

  describe("unknown permission strategy with all", () => {
    it("throws unknown_permission when all items are unknown and strategy is throw", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { all: ["unknown.perm"] },
        { unknownPermission: "throw", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("unknown_permission");
    });

    it("returns missing_permission when some items match but others are missing (throw)", () => {
      const model: AccessModel = { permissions: ["known.create"] };
      const result = checkPermission(
        model,
        { all: ["known.create", "unknown.perm"] },
        { unknownPermission: "throw", registry: ["known.perm", "known.create"] },
      );
      // known.create matches but unknown.perm is missing — the missing item
      // is unknown, so throw should apply
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("unknown_permission");
    });

    it("returns missing_permission when missing items are known (throw)", () => {
      const model: AccessModel = { permissions: ["known.create"] };
      const result = checkPermission(
        model,
        { all: ["known.create", "known.perm"] },
        { unknownPermission: "throw", registry: ["known.create", "known.perm"] },
      );
      // Both are in registry but known.perm is not in effective permissions
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
      expect(result.missing).toEqual(["known.perm"]);
    });

    it("returns missing_permission for all when strategy is warn", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { all: ["unknown.perm"] },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
    });
  });

  describe("checkedFrom accuracy", () => {
    it("sets checkedFrom to direct for exact direct match", () => {
      const model: AccessModel = { permissions: ["users.create"] };
      const result = checkPermission(model, { permission: "users.create" });
      expect(result.checkedFrom).toBe("direct");
    });

    it("sets checkedFrom to wildcard for wildcard match", () => {
      const model: AccessModel = { permissions: ["users.*"] };
      const result = checkPermission(model, { permission: "users.create" });
      expect(result.checkedFrom).toBe("wildcard");
    });

    it("sets checkedFrom to role for role-based match", () => {
      const model: AccessModel = {
        user: { roles: ["admin"] },
        permissions: [],
      };
      const result = checkPermission(
        model,
        { permission: "settings.view" },
        { rolePermissions: { admin: ["settings.view"] } },
      );
      expect(result.checkedFrom).toBe("role");
    });

    it("sets checkedFrom to none for denied", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(model, { permission: "users.create" });
      expect(result.checkedFrom).toBe("none");
    });

    it("sets checkedFrom to flag for flag checks", () => {
      const model: AccessModel = { flags: ["feature.x"] };
      const result = checkPermission(model, { flag: "feature.x" });
      expect(result.checkedFrom).toBe("flag");
    });
  });

  describe("edge cases", () => {
    it("handles empty permissions array", () => {
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(model, { permission: "anything" });
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
    });

    it("handles model with only flags", () => {
      const model: AccessModel = { flags: ["feature.x"] };
      const result = checkPermission(model, { permission: "anything" });
      expect(result.allowed).toBe(false);
    });
  });

  describe("invalid request", () => {
    it("returns invalid_request for empty input", () => {
      const result = checkPermission(baseModel, {} as any);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("invalid_request");
    });
  });

  describe("purity", () => {
    it("returns identical results for identical inputs regardless of call count", () => {
      const model: AccessModel = { permissions: ["users.create"] };
      const input = { permission: "users.create" };
      const options = {
        unknownPermission: "throw" as const,
        registry: ["users.create"] as readonly string[],
      };

      const results = Array.from({ length: 50 }, () =>
        checkPermission(model, input, options),
      );

      const first = results[0];
      for (const r of results) {
        expect(r).toEqual(first);
      }
    });

    it("does not throw for any input", () => {
      expect(() => checkPermission(null, { permission: "test" })).not.toThrow();
      expect(() =>
        checkPermission({ permissions: [] }, { permission: "test" }),
      ).not.toThrow();
      expect(() =>
        checkPermission({ permissions: ["a.*"] }, { permission: "a.b.c" }),
      ).not.toThrow();
    });

    it("does not retain state between calls", () => {
      const model: AccessModel = { permissions: [] };

      // First call with unknown permission under "throw" strategy
      const result1 = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "throw", registry: ["known.perm"] },
      );
      expect(result1.reason).toBe("unknown_permission");

      // Second call with same inputs — no hidden state should affect it
      const result2 = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "throw", registry: ["known.perm"] },
      );
      expect(result2).toEqual(result1);
    });

    it("warn strategy produces same decision output as ignore", () => {
      const model: AccessModel = { permissions: [] };
      const registry = ["known.perm"] as readonly string[];

      const withWarn = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "warn", registry },
      );
      const withIgnore = checkPermission(
        model,
        { permission: "unknown.perm" },
        { unknownPermission: "ignore", registry },
      );

      expect(withWarn).toEqual(withIgnore);
    });

    it("does not call console.warn as a side effect (engine is pure)", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const model: AccessModel = { permissions: [] };

        // Engine handles "warn" strategy without side effects —
        // it returns AccessDecision only, never calls console.warn
        checkPermission(
          model,
          { permission: "unknown.perm" },
          { unknownPermission: "warn", registry: ["known.perm"] },
        );
        checkPermission(
          model,
          { any: ["unknown.perm", "also.unknown"] },
          { unknownPermission: "warn", registry: ["known.perm"] },
        );
        checkPermission(
          model,
          { all: ["unknown.perm"] },
          { unknownPermission: "warn", registry: ["known.perm"] },
        );

        expect(spy).not.toHaveBeenCalled();
      } finally {
        spy.mockRestore();
      }
    });

    it("produces deterministic output independent of call ordering", () => {
      const modelA: AccessModel = { permissions: ["users.create"] };
      const modelB: AccessModel = { permissions: ["reports.export"] };

      // Calling in different order should not change individual results
      const r1 = checkPermission(modelA, { permission: "users.create" });
      const r2 = checkPermission(modelB, { permission: "reports.export" });
      const r3 = checkPermission(modelA, { permission: "users.create" });
      const r4 = checkPermission(modelB, { permission: "reports.export" });

      expect(r1).toEqual(r3);
      expect(r2).toEqual(r4);
    });

    it("does not use any module-level state (no warning cache or counters)", () => {
      // The engine should have no module-level mutable state.
      // Verify by checking that a never-before-requested permission
      // produces the same result as any other missing permission,
      // regardless of what was checked before it.
      const model: AccessModel = { permissions: ["existing.perm"] };

      const first = checkPermission(
        model,
        { permission: "brand.new.perm" },
        { unknownPermission: "throw", registry: ["existing.perm"] },
      );
      const second = checkPermission(
        model,
        { permission: "brand.new.perm" },
        { unknownPermission: "throw", registry: ["existing.perm"] },
      );

      // Both should be unknown (not in registry, not in effective perms)
      expect(first.reason).toBe("unknown_permission");
      expect(second).toEqual(first);
    });
  });
});
