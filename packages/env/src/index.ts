import { createEnv } from "@t3-oss/env-core";
import { dotenvLoad } from "dotenv-mono";
import { z } from "zod";

dotenvLoad();

export const env = createEnv({
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
  },
  client: {
    VITE_SERVER_URL: z.url(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    !!process.env.DOCKER_BUILD,
});
