## Clean Architecture Migration Guide

This document outlines the plan and steps required to refactor the monorepo to a Clean Architecture. The goal is to build a simple TODO app with email/password authentication.

### Core Principles & Technology

The architecture follows the **Dependency Rule** (dependencies point inwards) using distinct layers and packages.

- **API:** We will use **oRPC** for our API layer.
- **Authentication:** We will use **better-auth** for session management.
- **Database:** We will use **Drizzle ORM**.
- **Dependency Injection:** We will use **@evyweb/ioctopus**.

### Package Structure

-   `packages/business-logic`: **Domain Layer** (Entities, Use Cases, Interfaces).
-   `packages/shared`: **Shared Contracts** (DTOs / Zod Schemas).
-   `packages/db`: **Infrastructure Layer** (Drizzle repositories).
-   `packages/auth`: **Infrastructure Layer** (Authentication services).
-   `packages/orpc`: **Interface Adapter & Composition Root** (Controllers, DI Container, oRPC Router).
-   `apps/web`: **Presentation Layer** (UI).

---

### Migration Checklist & Code Snippets

**Phase 1: Define the Domain (`packages/business-logic`)**

1.  **Entities:** Zod schemas defining the core business objects.
    *File: `packages/business-logic/src/entities/models/todo.ts`*
    ```typescript
    import { z } from "zod";

    export const selectTodoSchema = z.object({
      id: z.number(),
      todo: z.string(),
      completed: z.boolean(),
      userId: z.string(),
    });
    export type Todo = z.infer<typeof selectTodoSchema>;
    ```

2.  **Repository & Service Interfaces:** The contracts for our infrastructure.
    *File: `packages/business-logic/src/application/repositories/todos.repository.interface.ts`*
    ```typescript
    export interface ITodosRepository {
      create(data: { content: string; userId: string }, tx?: any): Promise<Todo>;
      getForUser(userId: string): Promise<Todo[]>;
    }
    ```
    *File: `packages/business-logic/src/application/services/authentication.service.interface.ts`*
    ```typescript
    export interface IAuthenticationService {
      getSession(request: Request): Promise<{ user: User; session: Session } | undefined>;
    }
    ```

3.  **Use Cases (Higher-Order Functions):** The core, isolated business logic.
    *File: `packages/business-logic/src/application/use-cases/todos/create-todo.use-case.ts`*
    ```typescript
    export const createTodoUseCase =
      (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
      async (data: { content: string }, userId: string, tx?: unknown) => {
        return await instrumentationService.startSpan(
          { name: "createTodoUseCase" },
          async () => {
            const todo = await todosRepository.create(
              {
                content: data.content,
                userId,
              },
              tx,
            );
            return todo;
          },
        );
      };
    ```

**Phase 2: Define API Contracts (`packages/shared`)**
- *File: `packages/shared/src/schemas/todo.schema.ts`*
  ```typescript
  import { z } from "zod";

  export const createTodoSchema = z.object({
    content: z.string().min(1),
  });

  export const createTodoResponseSchema = z.object({
    id: z.number(),
    todo: z.string(),
    completed: z.boolean(),
    userId: z.string(),
  });
  ```

**Phase 3: Implement Infrastructure & Composition Root (`packages/orpc`)**

1.  **Type-Safe DI:** Create a utility to ensure dependency arrays match constructor/function signatures at compile time.
    *File: `packages/orpc/src/di/type-safe-binding.ts`*
    ```typescript
    import type { DI_RETURN_TYPES } from "~/di/types";

    type FindDISymbolKey<T> = {
      [K in keyof DI_RETURN_TYPES]: DI_RETURN_TYPES[K] extends T ? (T extends DI_RETURN_TYPES[K] ? K : never) : never;
    }[keyof DI_RETURN_TYPES];

    type MapTupleToDIKeys<T extends Array<any>> = T extends [] ? [] : T extends [infer Head, ...infer Tail] ? [FindDISymbolKey<Head>, ...MapTupleToDIKeys<Tail>] : Array<FindDISymbolKey<T[number]>>;

    export type ConstructorParamsToDIKeys<T extends new (...args: Array<any>) => any> = MapTupleToDIKeys<ConstructorParameters<T>>;
    export type FunctionParamsToDIKeys<T extends (...args: Array<any>) => any> = MapTupleToDIKeys<Parameters<T>>;
    ```

2.  **DI Module:** Use the type-safe utility to wire up dependencies for a feature.
    *File: `packages/orpc/src/di/modules/todos.module.ts`*
    ```typescript
    import { createModule } from "@evyweb/ioctopus";
    // ... other imports
    import type { ConstructorParamsToDIKeys, FunctionParamsToDIKeys } from "~/di/type-safe-binding";

    export function createTodosModule() {
      const todosModule = createModule();

      const repoDeps: ConstructorParamsToDIKeys<typeof TodosRepository> = [
        "IInstrumentationService",
        "ICrashReporterService",
      ];
      todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(TodosRepository, repoDeps.map(s => DI_SYMBOLS[s]));

      const useCaseDeps: FunctionParamsToDIKeys<typeof createTodoUseCase> = [
        "IInstrumentationService",
        "ITodosRepository",
      ];
      todosModule.bind(DI_SYMBOLS.ICreateTodoUseCase).toHigherOrderFunction(createTodoUseCase, useCaseDeps.map(s => DI_SYMBOLS[s]));

      // ... bind other use cases and controllers
      return todosModule;
    }
    ```

3.  **Controller:** Orchestrate the use case and infrastructure (like transactions).
    *File: `packages/orpc/src/controllers/todos/create-todo.controller.ts`*
    ```typescript
    export const createTodoController =
      (
        instrumentationService: IInstrumentationService,
        transactionManagerService: ITransactionManagerService,
        createTodoUseCase: ICreateTodoUseCase,
      ) =>
      async (input: { content: string; userId: string }): Promise<Todo> => {
        return await instrumentationService.startSpan({ name: "createTodo Controller" }, async () => {
          const todo = await transactionManagerService.startTransaction(async (tx) => {
            return createTodoUseCase({ content: input.content }, input.userId, tx);
          });
          return todo;
        });
      };
    ```

4.  **oRPC Router:** Define the API endpoint, handle validation, and connect to the controller.
    *File: `packages/orpc/src/routes/todos.ts`*
    ```typescript
    import { createTodoSchema, createTodoResponseSchema } from "@acme/shared/schemas/todo.schema";
    import { getInjection } from "~/di/container";
    import { protectedProcedure } from "~/procedures";

    const createTodo = protectedProcedure
      .input(createTodoSchema)
      .output(createTodoResponseSchema)
      .handler(async ({ input, context }) => {
        const createTodoController = getInjection("ICreateTodoController");
        return createTodoController({
          content: input.content,
          userId: context.session.user.id,
        });
      });

    export const todoRouter = {
      create: createTodo,
      // ... other routes
    };
    ```
