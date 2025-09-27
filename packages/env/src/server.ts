import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    IS_DOCKER_HOST: z.enum(["true", "false"]).default("false"),
    PORT: z.coerce.string().default("3001"),
    CORS_ORIGIN: z.url(),
    DATABASE_URL: z.url(),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    ASSET_PRELOAD_MAX_SIZE: z.number().default(5 * 1024 * 1024),
    ASSET_PRELOAD_INCLUDE_PATTERNS: z.string().default(""),
    ASSET_PRELOAD_EXCLUDE_PATTERNS: z.string().default(""),
    ASSET_PRELOAD_VERBOSE_LOGGING: z.string().default("true"),
    ASSET_PRELOAD_ENABLE_ETAG: z.string().default("true"),
    ASSET_PRELOAD_ENABLE_GZIP: z.string().default("true"),
    ASSET_PRELOAD_GZIP_MIN_SIZE: z.number().default(1024),
    ASSET_PRELOAD_GZIP_MIME_TYPES: z
      .string()
      .default(
        "text/,application/javascript,application/json,application/xml,image/svg+xml",
      ),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
