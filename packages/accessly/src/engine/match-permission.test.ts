import { describe, it, expect } from "vitest";
import { matchPermission } from "./match-permission";

describe("matchPermission", () => {
  it("matches exact permission", () => {
    expect(matchPermission("users.create", "users.create")).toBe(true);
  });

  it("rejects different permission", () => {
    expect(matchPermission("users.create", "users.delete")).toBe(false);
  });

  it("global wildcard matches everything", () => {
    expect(matchPermission("*", "users.create")).toBe(true);
    expect(matchPermission("*", "anything.here")).toBe(true);
    expect(matchPermission("*", "a.b.c.d.e")).toBe(true);
    expect(matchPermission("*", "single")).toBe(true);
  });

  it("resource wildcard matches one level", () => {
    expect(matchPermission("users.*", "users.create")).toBe(true);
    expect(matchPermission("users.*", "users.delete")).toBe(true);
  });

  it("resource wildcard does not match deeper nesting", () => {
    expect(matchPermission("users.*", "users.profile.edit")).toBe(false);
  });

  it("nested wildcard matches deeper", () => {
    expect(matchPermission("users.profile.*", "users.profile.edit")).toBe(true);
    expect(matchPermission("users.profile.*", "users.profile.view")).toBe(true);
  });

  it("rejects different resource with wildcard", () => {
    expect(matchPermission("users.*", "posts.create")).toBe(false);
  });

  it("wildcard at start matches any resource", () => {
    expect(matchPermission("*.create", "users.create")).toBe(true);
    expect(matchPermission("*.create", "posts.create")).toBe(true);
  });

  it("rejects when segment count differs", () => {
    expect(matchPermission("users.create", "users")).toBe(false);
    expect(matchPermission("users", "users.create")).toBe(false);
  });

  it("matches middle wildcard", () => {
    expect(matchPermission("users.*.edit", "users.profile.edit")).toBe(true);
    expect(matchPermission("users.*.edit", "users.settings.edit")).toBe(true);
  });

  it("rejects middle wildcard when other segments differ", () => {
    expect(matchPermission("users.*.edit", "posts.profile.edit")).toBe(false);
  });

  it("multiple wildcards in same pattern", () => {
    expect(matchPermission("*.profile.*", "users.profile.edit")).toBe(true);
    expect(matchPermission("*.profile.*", "admin.profile.view")).toBe(true);
    expect(matchPermission("*.profile.*", "users.settings.edit")).toBe(false);
  });

  it("consecutive wildcards", () => {
    expect(matchPermission("*.*", "users.create")).toBe(true);
    expect(matchPermission("*.*", "users")).toBe(false);
    expect(matchPermission("*.*", "a.b.c")).toBe(false);
  });

  it("all wildcard pattern", () => {
    expect(matchPermission("*.*.*", "a.b.c")).toBe(true);
    expect(matchPermission("*.*.*", "a.b")).toBe(false);
    expect(matchPermission("*.*.*", "a.b.c.d")).toBe(false);
  });

  it("handles empty strings gracefully", () => {
    expect(matchPermission("", "")).toBe(true);
    expect(matchPermission("", "a")).toBe(false);
    expect(matchPermission("a", "")).toBe(false);
  });

  it("case sensitivity", () => {
    expect(matchPermission("Users.Create", "users.create")).toBe(false);
    expect(matchPermission("USERS.*", "users.create")).toBe(false);
  });

  it("single segment exact match", () => {
    expect(matchPermission("admin", "admin")).toBe(true);
    expect(matchPermission("admin", "user")).toBe(false);
  });

  it("single segment wildcard", () => {
    expect(matchPermission("*", "anything")).toBe(true);
  });
});
