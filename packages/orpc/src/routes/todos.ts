import {
  createTodoResponseSchema,
  createTodoSchema,
  getTodosResponseSchema,
  toggleTodoResponseSchema,
  toggleTodoSchema,
} from "@acme/shared/schemas/todo.schema";

import { getInjection } from "~/di/container";
import { protectedProcedure } from "~/procedures";

const createTodo = protectedProcedure
  .input(createTodoSchema)
  .output(createTodoResponseSchema)
  .handler(async ({ input, context }) => {
    const createTodoController = getInjection("ICreateTodoController");
    const res = await createTodoController(
      {
        todo: input.todo,
      },
      context.session.user.id,
    );
    return res;
  });

const getTodos = protectedProcedure
  .output(getTodosResponseSchema)
  .handler(async ({ context }) => {
    const getTodosController = getInjection("IGetTodosForUserController");
    const res = await getTodosController(context.session.user.id);
    return res.sort((a, b) => a.id - b.id);
  });

const toggleTodo = protectedProcedure
  .input(toggleTodoSchema)
  .output(toggleTodoResponseSchema)
  .handler(async ({ context, input }) => {
    const toggleTodoController = getInjection("IToggleTodoController");
    const res = await toggleTodoController(
      {
        todoId: input.todoId,
      },
      context.session.user.id,
    );
    return res;
  });

export const todoRouter = {
  create: createTodo,
  get: getTodos,
  toggle: toggleTodo,
};
