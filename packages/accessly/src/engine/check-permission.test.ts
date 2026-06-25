import { describe, it, expect, beforeEach } from "vitest";
import { checkPermission, resetWarnings } from "./check-permission";
import type { AccessModel } from "../types/access";

const baseModel: AccessModel = {
  permissions: ["users.create", "users.delete", "reports.export"],
  flags: ["features.new-dashboard"],
  user: {
    roles: ["admin"],
  },
};

beforeEach(() => {
  resetWarnings();
});

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

    it("warns for each unknown permission in any when strategy is warn", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const model: AccessModel = { permissions: [] };
      const result = checkPermission(
        model,
        { any: ["unknown.perm", "also.unknown"] },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("missing_permission");
      // Should warn for both unknown permissions
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });

    it("does not warn in any for permissions in registry", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const model: AccessModel = { permissions: [] };
      checkPermission(
        model,
        { any: ["known.perm"] },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
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

    it("warns for unknown permissions in all when strategy is warn", () => {
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

    it("does not warn in all for permissions in registry that are missing", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const model: AccessModel = { permissions: [] };
      checkPermission(
        model,
        { all: ["known.perm"] },
        { unknownPermission: "warn", registry: ["known.perm"] },
      );
      // known.perm is in registry, so it's not unknown — user just doesn't have it
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
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
});
