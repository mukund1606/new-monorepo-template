/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  extends: [dbEnv],
  server: {
    BETTER_AUTH_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1, { message: "BETTER_AUTH_SECRET is required" }),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
