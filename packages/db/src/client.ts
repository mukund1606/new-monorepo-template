import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { BunSQLTransaction } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "~/env";
import * as schema from "~/schema";

const globalForDb = globalThis as unknown as {
  client: SQL | undefined;
};

const client = globalForDb.client ?? new SQL(env.DATABASE_URL);

if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });

export type Database = typeof db;

type Schema = typeof schema;

export type Transaction = BunSQLTransaction<Schema, ExtractTablesWithRelations<Schema>>;
