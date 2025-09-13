import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    VITE_SERVER_URL: z.url(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: process.env && import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
