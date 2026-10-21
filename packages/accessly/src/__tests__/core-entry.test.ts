import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import * as core from "../core";

describe("accessly/core entry", () => {
  it("exports the React-free engine", () => {
    const decision = core.checkPermission(
      { user: { roles: ["admin"] }, permissions: ["users.*"] },
      { permission: "users.create" },
    );

    expect(decision.allowed).toBe(true);
    expect(typeof core.createAccessChecker).toBe("function");
    expect(typeof core.filterNavigation).toBe("function");
    expect(typeof core.formatDecision).toBe("function");
  });

  it("does not export React APIs", () => {
    expect("PermissionProvider" in core).toBe(false);
    expect("Can" in core).toBe(false);
    expect("usePermission" in core).toBe(false);
  });

  it("does not import React at runtime", () => {
    const source = readFileSync(resolve(__dirname, "../core.ts"), "utf8");
    expect(source).not.toMatch(/from "\.\/react/);
  });
});
