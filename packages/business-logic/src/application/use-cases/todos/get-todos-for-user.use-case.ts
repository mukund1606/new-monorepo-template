import type { ITodosRepository } from "~/application/repositories/todos.repository.interface";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { Todo } from "~/entities/models/todo";

export type IGetTodosForUserUseCase = ReturnType<typeof getTodosForUserUseCase> & {
  __brand: "IGetTodosForUserUseCase";
};

export const getTodosForUserUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (userId: string): Promise<Array<Todo>> => {
    return instrumentationService.startSpan(
      { name: "getTodosForUser UseCase", op: "function" },
      async () => {
        return await todosRepository.getTodosForUser(userId);
      },
    );
  };
