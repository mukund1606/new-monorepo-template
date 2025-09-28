import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "@acme/db/client";

import { env } from "~/env";

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [reactStartCookies()],
} satisfies BetterAuthOptions;
