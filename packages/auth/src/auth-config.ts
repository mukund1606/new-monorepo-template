import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@acme/db/client";

import { env } from "~/env";

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.CLIENT_URL],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
} satisfies BetterAuthOptions;
