import type { ITodosRepository } from "~/application/repositories/todos.repository.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { Todo } from "~/entities/models/todo";
import { InputParseError } from "~/entities/errors/common";

export type ICreateTodoUseCase = ReturnType<typeof createTodoUseCase> & {
  __brand: "ICreateTodoUseCase";
};

export const createTodoUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (
    input: {
      todo: string;
    },
    userId: string,
    tx?: unknown,
  ): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: "createTodo Use Case", op: "function" },
      async () => {
        // HINT: this is where you'd do authorization checks - is this user authorized to create a todo
        // for example: free users are allowed only 5 todos, throw an UnauthorizedError if more than 5

        if (input.todo.length < 4) {
          throw new InputParseError("Todo must be at least 4 chars");
        }

        const newTodo = await todosRepository.createTodo(
          {
            todo: input.todo,
            userId,
            completed: false,
          },
          tx,
        );

        return newTodo;
      },
    );
  };
