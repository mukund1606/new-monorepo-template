## Clean Architecture Migration Guide (for a TODO App)

This document outlines the plan and steps required to refactor the monorepo to a Clean Architecture, inspired by the `nextjs-clean-architecture` project. The goal is to build a simple TODO app with email/password authentication.

### Core Principles & Technology

The architecture will follow the **Dependency Rule** (dependencies point inwards) using distinct layers and packages.

- **API:** We will use **oRPC** for our API layer.
- **Authentication:** We will use **better-auth** for session management.
- **Database:** We will use **Drizzle ORM**.
- **Dependency Injection:** We will use **@evyweb/ioctopus**.

### Proposed Package Structure

-   `packages/business-logic`: **Domain Layer** (Entities, Use Cases, Interfaces).
-   `packages/shared`: **Shared Contracts** (DTOs).
-   `packages/db`: **Infrastructure Layer** (Drizzle repositories).
-   `packages/auth`: **Infrastructure Layer** (Authentication services).
-   `packages/orpc`: **Interface Adapter & Composition Root** (Controllers, DI Container, oRPC Router).
-   `apps/web`: **Presentation Layer** (UI).

---

### Migration Checklist & Code Snippets

**Phase 1: Setup & Scaffolding**
- [ ] Create the new `packages/business-logic` package.
- [ ] Install dependencies: `@evyweb/ioctopus`, `zod`, `better-auth`, `vitest`.
- [ ] Configure `eslint-plugin-boundaries` to enforce architectural rules.

**Phase 2: Define the Domain (`packages/business-logic`)**

1.  **Entities:** Plain interfaces or classes.
    *File: `packages/business-logic/src/entities/todo.entity.ts`*
    ```typescript
    export interface Todo { id: number; text: string; completed: boolean; userId: string; }
    ```

2.  **Repository & Service Interfaces:** The contracts for infrastructure.
    *File: `packages/business-logic/src/repositories/i-todo.repository.ts`*
    ```typescript
    export interface ITodoRepository { create(todo: { text: string; userId: string }): Promise<Todo>; /* ... */ }
    ```
    *File: `packages/business-logic/src/services/i-auth.service.ts`*
    ```typescript
    export interface IAuthService { validateSession(sessionId: string): Promise<{ userId: string }>; /* ... */ }
    ```
    *File: `packages/business-logic/src/services/i-tx-manager.service.ts`*
    ```typescript
    export interface ITransactionManager { startTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>; }
    ```

3.  **Use Cases (Higher-Order Functions):** The core business logic.
    *File: `packages/business-logic/src/use-cases/create-todo.usecase.ts`*
    ```typescript
    import type { ITodoRepository } from '../repositories/i-todo.repository';
    import { Todo } from '../entities/todo.entity';

    export const createTodoUseCase = 
      (todoRepository: ITodoRepository) => 
      async (text: string, userId: string, tx?: any): Promise<Todo> => {
        if (text.length < 2) throw new Error('Todo text must be at least 2 characters long.');
        return todoRepository.create({ text, userId }, tx);
      };

    export type ICreateTodoUseCase = ReturnType<typeof createTodoUseCase>;
    ```

**Phase 3: Define API Contracts (`packages/shared`)**
- *File: `packages/shared/src/dtos/todo.dto.ts`*
  ```typescript
  import { z } from 'zod';
  export const createTodoRequestSchema = z.object({ text: z.string() });
  export const todoResponseSchema = z.object({ id: z.number(), text: z.string(), completed: z.boolean() });
  export const todosResponseSchema = z.array(todoResponseSchema);
  export type TodoResponse = z.infer<typeof todoResponseSchema>;
  ```

**Phase 4: Implement Infrastructure**

1.  **`packages/db`:** Implement repositories.
    *File: `packages/db/src/repositories/drizzle-todo.repository.ts`*
    ```typescript
    import { ITodoRepository, Todo } from '@my-monorepo/business-logic';
    import { db } from '../client';
    import { todosTable } from '../schema';

    export class DrizzleTodoRepository implements ITodoRepository {
      async create(todo: { text: string; userId: string }, tx?: any): Promise<Todo> {
        const db_ = tx ?? db;
        const [newTodo] = await db_.insert(todosTable).values(todo).returning();
        return newTodo;
      }
    }
    ```

2.  **`packages/orpc`:** Wire everything together.

    *File: `packages/orpc/src/di/types.ts`*
    ```typescript
    export const DI_SYMBOLS = {
      ITodoRepository: Symbol.for('ITodoRepository'),
      IAuthService: Symbol.for('IAuthService'),
      ITransactionManager: Symbol.for('ITransactionManager'),
      ICreateTodoUseCase: Symbol.for('ICreateTodoUseCase'),
      ITodoController: Symbol.for('ITodoController'),
    };
    ```

    *File: `packages/orpc/src/controllers/todo.controller.ts`*
    ```typescript
    import { createTodoRequestSchema, TodoResponse } from '@my-monorepo/shared';
    import type { ICreateTodoUseCase, IAuthService, ITransactionManager } from '@my-monorepo/business-logic';

    // The controller orchestrates services and use cases.
    export const todoController = 
      (authService: IAuthService, txManager: ITransactionManager, createTodoUseCase: ICreateTodoUseCase) => 
      async (input: unknown, sessionId?: string): Promise<TodoResponse[]> => {
        if (!sessionId) throw new Error('UNAUTHORIZED');
        const { userId } = await authService.validateSession(sessionId);

        const { text } = createTodoRequestSchema.parse(input);
        const todoTexts = text.split(',').map(t => t.trim()).filter(Boolean);

        const createdTodos = await txManager.startTransaction(async (tx) => {
          const promises = todoTexts.map(t => createTodoUseCase(t, userId, tx));
          return Promise.all(promises);
        });

        // Map entities to DTOs before returning
        return createdTodos.map(todo => ({ id: todo.id, text: todo.text, completed: todo.completed }));
      };

    export type ITodoController = ReturnType<typeof todoController>;
    ```

    *File: `packages/orpc/src/di/container.ts`*
    ```typescript
    import { createContainer, createModule } from '@evyweb/ioctopus';
    import { DI_SYMBOLS } from './types';
    import { DrizzleTodoRepository } from '@my-monorepo/db';
    import { AuthService } from '@my-monorepo/auth'; // Assuming this exists
    import { TransactionManager } from '@my-monorepo/db'; // Assuming this exists
    import { createTodoUseCase } from '@my-monorepo/business-logic';
    import { todoController } from '../controllers/todo.controller';

    const appContainer = createContainer();

    const todosModule = createModule()
      .bind(DI_SYMBOLS.ITodoRepository).toClass(DrizzleTodoRepository)
      .bind(DI_SYMBOLS.IAuthService).toClass(AuthService)
      .bind(DI_SYMBOLS.ITransactionManager).toClass(TransactionManager)
      .bind(DI_SYMBOLS.ICreateTodoUseCase).toHigherOrderFunction(createTodoUseCase, [DI_SYMBOLS.ITodoRepository])
      .bind(DI_SYMBOLS.ITodoController).toHigherOrderFunction(todoController, [
        DI_SYMBOLS.IAuthService,
        DI_SYMBOLS.ITransactionManager,
        DI_SYMBOLS.ICreateTodoUseCase,
      ]);

    appContainer.load(Symbol('TodosModule'), todosModule);

    export function getInjection<T>(symbol: symbol): T {
        return appContainer.get<T>(symbol);
    }
    ```

    *File: `packages/orpc/src/routes/todos.ts`*
    ```typescript
    import { o } from '../orpc';
    import { getInjection } from '../di/container';
    import { DI_SYMBOLS } from '../di/types';
    import type { ITodoController } from '../controllers/todo.controller';
    import { createTodoRequestSchema, todosResponseSchema } from '@my-monorepo/shared';

    const createTodos = getInjection<ITodoController>(DI_SYMBOLS.ITodoController);

    export const todoRoutes = o.router({
      create: o.procedure
        .input(createTodoRequestSchema)
        .output(todosResponseSchema)
        .mutation(async ({ input, ctx }) => {
          // Pass the raw session ID from context to the controller
          return createTodos(input, ctx.sessionId);
        }),
    });
    ```

**Phase 5 & 6 remain the same.**