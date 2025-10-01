import type { ITodosRepository } from "~/application/repositories/todos.repository.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { Todo } from "~/entities/models/todo";
import type { ITransaction } from "~/entities/models/transaction.interface";
import { UnauthorizedError } from "~/entities/errors/auth";
import { NotFoundError } from "~/entities/errors/common";

export type IDeleteTodoUseCase = ReturnType<typeof deleteTodoUseCase> & {
  __brand: "IDeleteTodoUseCase";
};

export const deleteTodoUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (
    input: {
      todoId: number;
    },
    userId: string,
    tx?: ITransaction,
  ): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: "deleteTodo Use Case", op: "function" },
      async () => {
        const todo = await todosRepository.getTodo(input.todoId);

        if (!todo) {
          throw new NotFoundError("Todo does not exist");
        }

        if (todo.userId !== userId) {
          throw new UnauthorizedError("Cannot delete todo. Reason: unauthorized");
        }

        await todosRepository.deleteTodo(todo.id, tx);

        return todo;
      },
    );
  };
