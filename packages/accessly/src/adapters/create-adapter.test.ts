import { describe, it, expect } from "vitest";
import { createAdapter } from "./create-adapter";

describe("createAdapter", () => {
  it("creates an adapter with a normalize function", () => {
    const adapter = createAdapter((source: { perms: string[] }) => ({
      permissions: source.perms,
    }));
    const result = adapter.normalize({ perms: ["a", "b"] });
    expect(result.permissions).toEqual(["a", "b"]);
  });
});
