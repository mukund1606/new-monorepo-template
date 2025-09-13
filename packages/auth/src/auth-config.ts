import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@acme/db/client";

import { serverEnv } from "~/env.server";

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: serverEnv.CORS_ORIGIN,
  secret: serverEnv.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
} satisfies BetterAuthOptions;
