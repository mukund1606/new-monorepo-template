import { z } from "zod";

export const createTodoSchema = z.object({
  todo: z.string().min(1),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const createTodoResponseSchema = z.object({
  id: z.number(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.string(),
});

export const getTodosResponseSchema = z.array(createTodoResponseSchema);

export type GetTodosResponse = z.infer<typeof getTodosResponseSchema>;

export type CreateTodoResponse = z.infer<typeof createTodoResponseSchema>;

export const toggleTodoSchema = z.object({
  todoId: z.number(),
});

export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;

export const toggleTodoResponseSchema = createTodoResponseSchema;

export type ToggleTodoResponse = z.infer<typeof toggleTodoResponseSchema>;
