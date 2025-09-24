import { defineConfig } from "drizzle-kit";

import { env } from "@acme/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
