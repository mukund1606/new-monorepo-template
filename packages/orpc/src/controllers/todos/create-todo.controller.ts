import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { ITransactionManagerService } from "@acme/business-logic/application/services/transaction-manager.service.interface";
import type { ICreateTodoUseCase } from "@acme/business-logic/application/use-cases/todos/create-todo.use-case";
import type { Todo } from "@acme/business-logic/entities/models/todo";
import type { CreateTodoInput } from "@acme/shared/schemas/todo.schema";

function presenter(todo: Todo, instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan(
    { name: "createTodo Presenter", op: "serialize" },
    () => {
      return {
        id: todo.id,
        todo: todo.todo,
        userId: todo.userId,
        completed: todo.completed,
      };
    },
  );
}

export type ICreateTodoController = ReturnType<typeof createTodoController> & {
  __brand: "ICreateTodoController";
};

export const createTodoController =
  (
    instrumentationService: IInstrumentationService,
    transactionManagerService: ITransactionManagerService,
    createTodoUseCase: ICreateTodoUseCase,
  ) =>
  async (
    input: CreateTodoInput,
    userId: string,
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      {
        name: "createTodo Controller",
      },
      async () => {
        const todo = await instrumentationService.startSpan(
          { name: "Create Todo Transaction" },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                const res = await createTodoUseCase({ todo: input.todo }, userId, tx);
                return res;
              } catch (err) {
                console.error("Rolling back!");
                tx.rollback();
                throw err;
              }
            }),
        );
        return presenter(todo, instrumentationService);
      },
    );
  };
