import type { ITodosRepository } from "@acme/business-logic/application/repositories/todos.repository.interface";
import type { ICrashReporterService } from "@acme/business-logic/application/services/crash-reporter.service.interface";
import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { Todo, TodoInsert } from "@acme/business-logic/entities/models/todo";
import { DatabaseOperationError } from "@acme/business-logic/entities/errors/common";

import type { Transaction } from "~/client";
import { db } from "~/client";
import { eq } from "~/index";
import { todos } from "~/schema";

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService,
  ) {}

  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: "TodosRepository > createTodo" },
      async () => {
        try {
          const query = invoker.insert(todos).values(todo).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError("Cannot create todo");
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await this.instrumentationService.startSpan(
      { name: "TodosRepository > getTodo" },
      async () => {
        try {
          const query = db.query.todos.findFirst({
            where: eq(todos.id, id),
          });

          const todo = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );

          return todo;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async getTodosForUser(userId: string): Promise<Array<Todo>> {
    return await this.instrumentationService.startSpan(
      { name: "TodosRepository > getTodosForUser" },
      async () => {
        try {
          const query = db.query.todos.findMany({
            where: eq(todos.userId, userId),
          });

          const usersTodos = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );
          return usersTodos;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: "TodosRepository > updateTodo" },
      async () => {
        try {
          const query = db.update(todos).set(input).where(eq(todos.id, id)).returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );
          return updated!;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async deleteTodo(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? db;

    await this.instrumentationService.startSpan(
      { name: "TodosRepository > deleteTodo" },
      async () => {
        try {
          const query = invoker.delete(todos).where(eq(todos.id, id)).returning();

          await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }
}
