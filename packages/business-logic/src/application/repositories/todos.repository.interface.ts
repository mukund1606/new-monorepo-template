import type { Todo, TodoInsert } from "~/entities/models/todo";

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: unknown): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Array<Todo>>;
  updateTodo(id: number, input: Partial<TodoInsert>, tx?: unknown): Promise<Todo>;
  deleteTodo(id: number, tx?: unknown): Promise<void>;
}
