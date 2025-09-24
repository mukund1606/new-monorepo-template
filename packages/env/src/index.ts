import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.url(),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().default("http://localhost:3000"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
