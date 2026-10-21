import { defineConfig } from "tsup";

export default defineConfig([
  {
    // Root entry includes the React provider, hooks and components, so it is
    // marked as a client module for Next.js App Router.
    // Rollup tree-shaking strips module directives, so it stays off here.
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: ["react"],
    banner: { js: '"use client";' },
  },
  {
    // React-free entry for server code: accessly/core.
    entry: { core: "src/core.ts" },
    format: ["esm", "cjs"],
    dts: true,
    treeshake: true,
    external: ["react"],
  },
]);
