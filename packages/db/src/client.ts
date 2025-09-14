import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "@acme/env";

import * as schema from "~/schema";

const globalForDb = globalThis as unknown as {
  conn: SQL | undefined;
};

const conn =
  globalForDb.conn ??
  new SQL({
    url: env.DATABASE_URL,
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export type Database = typeof db;
