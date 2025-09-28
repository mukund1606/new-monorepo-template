/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-core";
import { vercel } from "@t3-oss/env-core/presets-zod";
import { z } from "zod";

import { env as authEnv } from "@acme/auth/env";
import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  extends: [vercel(), authEnv, dbEnv],
  server: {
    PORT: z.string().default("3000"),
    STATIC_PRELOAD_MAX_BYTES: z.number().default(5 * 1024 * 1024),
    STATIC_PRELOAD_INCLUDE: z.string().default(""),
    STATIC_PRELOAD_EXCLUDE: z.string().default(""),
    STATIC_PRELOAD_VERBOSE: z.string().default("true"),
    STATIC_PRELOAD_ETAG: z.string().default("true"),
    STATIC_PRELOAD_GZIP: z.string().default("true"),
    STATIC_PRELOAD_GZIP_MIN_BYTES: z.number().default(1024),
    STATIC_PRELOAD_GZIP_TYPES: z
      .string()
      .default(
        "text/,application/javascript,application/json,application/xml,image/svg+xml",
      ),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_BASE_URL: z.url().default("/"),
  },
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
});
