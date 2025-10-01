import { z } from "zod";

import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { IToggleTodoUseCase } from "@acme/business-logic/application/use-cases/todos/toggle-todo.use-case";
import type { Todo } from "@acme/business-logic/entities/models/todo";
import { InputParseError } from "@acme/business-logic/entities/errors/common";

function presenter(todo: Todo, instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan(
    { name: "toggleTodo Presenter", op: "serialize" },
    () => ({
      id: todo.id,
      todo: todo.todo,
      userId: todo.userId,
      completed: todo.completed,
    }),
  );
}

const inputSchema = z.object({ todoId: z.number() });

export type IToggleTodoController = ReturnType<typeof toggleTodoController> & {
  __brand: "IToggleTodoController";
};

export const toggleTodoController =
  (
    instrumentationService: IInstrumentationService,
    toggleTodoUseCase: IToggleTodoUseCase,
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    userId: string,
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: "toggleTodo Controller" },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError("Invalid data", { cause: inputParseError });
        }

        const todo = await toggleTodoUseCase({ todoId: data.todoId }, userId);

        return presenter(todo, instrumentationService);
      },
    );
  };
