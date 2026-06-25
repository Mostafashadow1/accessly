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
});
