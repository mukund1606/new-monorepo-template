import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

import { users } from "~/auth-schema";

export const todos = pgTable("todos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  todo: text("todo").notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export * from "~/auth-schema";
