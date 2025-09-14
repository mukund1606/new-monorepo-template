import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { serverEnv } from "@acme/env/server";

import * as schema from "~/schema";

const globalForDb = globalThis as unknown as {
  conn: SQL | undefined;
};

const conn =
  globalForDb.conn ??
  new SQL({
    url: serverEnv.DATABASE_URL,
  });

if (serverEnv.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export type Database = typeof db;
