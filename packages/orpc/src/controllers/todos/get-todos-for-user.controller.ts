import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { IGetTodosForUserUseCase } from "@acme/business-logic/application/use-cases/todos/get-todos-for-user.use-case";
import type { Todo } from "@acme/business-logic/entities/models/todo";

function presenter(todos: Array<Todo>, instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan(
    { name: "getTodosForUser Presenter", op: "serialize" },
    () =>
      todos.map((t) => ({
        id: t.id,
        todo: t.todo,
        userId: t.userId,
        completed: t.completed,
      })),
  );
}

export type IGetTodosForUserController = ReturnType<typeof getTodosForUserController> & {
  __brand: "IGetTodosForUserController";
};

export const getTodosForUserController =
  (
    instrumentationService: IInstrumentationService,
    getTodosForUserUseCase: IGetTodosForUserUseCase,
  ) =>
  async (userId: string): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: "getTodosForUser Controller" },
      async () => {
        const todos = await getTodosForUserUseCase(userId);

        return presenter(todos, instrumentationService);
      },
    );
  };
