import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@acme/db/client";
import { env } from "@acme/env";

export type Plugins = [ReturnType<typeof openAPI>];

const plugins: Plugins = [openAPI()];

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  secret: env.AUTH_SECRET,
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
