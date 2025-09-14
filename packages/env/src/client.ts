import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    VITE_SERVER_URL: z.url().default("http://localhost:3000"),
    VITE_BASE_URL: z.string().default("/"),
  },
  clientPrefix: "VITE_",
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    !!process.env.DOCKER_BUILD,
});
