import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@acme/db/client";
import { serverEnv } from "@acme/env/server";

export type Plugins = [ReturnType<typeof openAPI>];

const plugins: Plugins = [openAPI()];

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: serverEnv.CORS_ORIGIN,
  secret: serverEnv.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
} satisfies BetterAuthOptions;
