import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@acme/db/client";
import { env } from "@acme/env";

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: env.CORS_ORIGIN,
  secret: env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
} satisfies BetterAuthOptions;
