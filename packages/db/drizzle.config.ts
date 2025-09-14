import { defineConfig } from "drizzle-kit";

import { serverEnv } from "@acme/env/server";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
