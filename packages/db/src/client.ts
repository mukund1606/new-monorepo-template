import type { Sql } from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "~/schema";

const globalForDb = globalThis as unknown as {
  conn: Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export type Database = typeof db;
