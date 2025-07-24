import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  experimental: {
    browserDebugInfoInTerminal: true,
    devtoolSegmentExplorer: true,
  }
};

export default nextConfig;
