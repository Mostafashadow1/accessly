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
  });

  describe("unknown permission strategy", () => {
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
  });

  describe("invalid request", () => {
    it("returns invalid_request for empty input", () => {
      const result = checkPermission(baseModel, {} as any);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("invalid_request");
    });
  });
});
