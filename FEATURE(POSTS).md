# Feature Implementation Guide: Posts

This document outlines the step-by-step process for implementing a new feature (`Posts`) following our established Clean Architecture principles.

---

### Step 1: Define the Core Domain (`packages/business-logic`)

This is the foundation. We define what a "Post" is and what we can do with it, without thinking about databases or APIs yet.

1.  **Create the Entity:** Define the shape and rules of a `Post`.
    *File: `packages/business-logic/src/entities/models/post.ts`*
    ```typescript
    import { z } from 'zod';

    export const postStatusSchema = z.enum(["draft", "published", "deleted"]);
    export type PostStatus = z.infer<typeof postStatusSchema>;

    export const selectPostSchema = z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      status: postStatusSchema,
      userId: z.string(),
    });
    export type Post = z.infer<typeof selectPostSchema>;
    ```

2.  **Create the Repository Interface:** Define the contract for data storage. What methods will our use cases need from the database?
    *File: `packages/business-logic/src/application/repositories/posts.repository.interface.ts`*
    ```typescript
    import type { Post, PostStatus } from '~/entities/models/post';

    export interface IPostsRepository {
      create(data: { name: string; description: string; userId: string }): Promise<Post>;
      update(postId: number, data: { name?: string; description?: string; status?: PostStatus }): Promise<Post>;
      delete(postId: number): Promise<void>;
      findById(postId: number): Promise<Post | null>;
      getAllPublished(): Promise<Post[]>;
      getAllByUserIdAndStatus(userId: string, status: PostStatus): Promise<Post[]>;
    }
    ```

3.  **Create the Use Cases:** Implement the core business logic for each action. These are pure functions that depend only on the repository interface.

    *File: `packages/business-logic/src/application/use-cases/posts/create-post.use-case.ts`*
    ```typescript
    // Example for CreatePostUseCase
    export const createPostUseCase =
      (postsRepository: IPostsRepository) =>
      async (data: { name: string; description: string; userId: string }) => {
        // Business logic could go here, e.g., checking for profanity.
        return postsRepository.create(data);
      };
    ```

    *File: `packages/business-logic/src/application/use-cases/posts/update-post.use-case.ts`*
    ```typescript
    // Example for UpdatePostUseCase
    export const updatePostUseCase =
      (postsRepository: IPostsRepository) =>
      async (data: { postId: number; userId: string; name?: string; description?: string }) => {
        const post = await postsRepository.findById(data.postId);
        if (!post) throw new Error("Post not found");
        if (post.userId !== data.userId) throw new Error("UNAUTHORIZED"); // Authorization check

        return postsRepository.update(data.postId, { name: data.name, description: data.description });
      };
    ```

### Step 2: Define the Public API Contracts (`packages/shared`)

This is what the outside world (our frontend) will see.

1.  **Create DTO Schemas:** Define the Zod schemas for API inputs and outputs.
    *File: `packages/shared/src/schemas/post.schema.ts`*
    ```typescript
    import { z } from 'zod';

    export const createPostSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      description: z.string().min(10, "Description must be at least 10 characters long"),
    });

    export const updatePostSchema = z.object({
      postId: z.number(),
      name: z.string().min(3).optional(),
      description: z.string().min(10).optional(),
    });

    export const postResponseSchema = z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      status: z.string(),
      userId: z.string(),
    });
    ```

### Step 3: Implement the Infrastructure (`packages/db`)

Now we write the code that actually talks to the database.

1.  **Create the Database Schema:** Define the `posts` table in a new schema file or existing one.
    *File: `packages/db/src/schema.ts`*
    ```typescript
    export const posts = pgTable('posts', {
      id: serial('id').primaryKey(),
      name: varchar('name', { length: 256 }).notNull(),
      description: text('description').notNull(),
      status: varchar('status', { length: 50 }).default('draft').notNull(),
      userId: varchar('user_id', { length: 255 }).notNull(),
    });
    ```
    *(Remember to run `bun db:generate` and `bun db:migrate` after this.)*

2.  **Implement the Repository:** Create the class that fulfills the `IPostsRepository` contract using Drizzle.
    *File: `packages/db/src/repositories/posts.repository.ts`*
    ```typescript
    import { IPostsRepository, Post } from '@acme/business-logic';
    import { db } from '../client';
    import { posts } from '../schema';
    import { eq } from 'drizzle-orm';

    export class PostsRepository implements IPostsRepository {
      async findById(id: number): Promise<Post | null> {
        const result = await db.select().from(posts).where(eq(posts.id, id));
        return result[0] ?? null;
      }
      // ... implement all other methods (create, update, getAllPublished, etc.)
    }
    ```

### Step 4: Wire Everything Together (`packages/orpc`)

This is the composition root where we connect all the pieces.

1.  **Create Controllers:** For each use case, create a controller that orchestrates it.
    *File: `packages/orpc/src/controllers/posts/create-post.controller.ts`*
    ```typescript
    export const createPostController =
      (createPostUseCase: ICreatePostUseCase, txManager: ITransactionManagerService) =>
      async (input: { name: string; description: string; userId: string }) => {
        return txManager.startTransaction(async () => {
          return createPostUseCase(input);
        });
      };
    ```

2.  **Update DI Container:**
    *   Add all new symbols (`IPostsRepository`, `ICreatePostUseCase`, `ICreatePostController`, etc.) to `packages/orpc/src/di/types.ts`.
    *   Create a new `packages/orpc/src/di/modules/posts.module.ts`.
    *   Inside, use your type-safe binding helper to bind the `PostsRepository` to `IPostsRepository`, and bind all your new use cases and controllers to their respective interfaces.

3.  **Create the API Router:** Define the oRPC procedures for the posts feature.
    *File: `packages/orpc/src/routes/posts.ts`*
    ```typescript
    import { createPostSchema, postResponseSchema } from '@acme/shared/schemas/post.schema';
    import { getInjection } from '~/di/container';
    import { protectedProcedure, publicProcedure } from '~/procedures';
    import { os } from '@orpc/server';

    export const postsRouter = os.router({
      create: protectedProcedure
        .input(createPostSchema)
        .handler(async ({ input, context }) => {
          const controller = getInjection('ICreatePostController');
          return controller({ ...input, userId: context.session.user.id });
        }),

      getAllPublished: publicProcedure // This one is public!
        .handler(async () => {
          const controller = getInjection('IGetAllPublishedPostsController');
          return controller.execute(); // Assuming controller has execute method
        }),

      // ... define all other routes (delete, update, etc.)
    });
    ```

4.  **Update the Main App Router:** Add the new `postsRouter` to your main router.
    *File: `packages/orpc/src/index.ts`*
    ```typescript
    // ...
    import { postsRouter } from './routes/posts';

    export const appRouter = os.router({
      todos: todosRouter,
      posts: postsRouter, // Add the new router
    });
    // ...
    ```
