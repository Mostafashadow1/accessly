import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["accessly"],
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
