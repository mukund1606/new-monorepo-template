/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { env as authEnv } from "@acme/auth/env";
import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  extends: [authEnv, dbEnv],
  server: {
    PORT: z.string().default("3000"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
