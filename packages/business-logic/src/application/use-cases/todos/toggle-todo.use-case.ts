import type { ITodosRepository } from "~/application/repositories/todos.repository.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { Todo } from "~/entities/models/todo";
import type { ITransaction } from "~/entities/models/transaction.interface";
import { UnauthorizedError } from "~/entities/errors/auth";
import { NotFoundError } from "~/entities/errors/common";

export type IToggleTodoUseCase = ReturnType<typeof toggleTodoUseCase> & {
  __brand: "IToggleTodoUseCase";
};

export const toggleTodoUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (
    input: {
      todoId: number;
    },
    userId: string,
    tx?: ITransaction,
  ): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: "toggleTodo Use Case", op: "function" },
      async () => {
        const todo = await todosRepository.getTodo(input.todoId);

        if (!todo) {
          throw new NotFoundError("Todo does not exist");
        }

        if (todo.userId !== userId) {
          throw new UnauthorizedError("Cannot toggle todo. Reason: unauthorized");
        }

        const updatedTodo = await todosRepository.updateTodo(
          todo.id,
          {
            completed: !todo.completed,
          },
          tx,
        );

        return updatedTodo;
      },
    );
  };
