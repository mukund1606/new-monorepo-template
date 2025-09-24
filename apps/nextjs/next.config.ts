import type { NextConfig } from "next";

import "@acme/env";

const config = {
  typedRoutes: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/auth",
    "@acme/db",
    "@acme/env",
    "@acme/orpc",
    "@acme/shared",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} satisfies NextConfig;

export default config;
