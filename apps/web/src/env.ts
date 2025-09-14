import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    IS_DOCKER_HOST: z.enum(["true", "false"]).default("false"),
    PORT: z.coerce.string().default("3001"),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
