import { createModule } from "@evyweb/ioctopus";

import { createTodoUseCase } from "@acme/business-logic/application/use-cases/todos/create-todo.use-case";
import { deleteTodoUseCase } from "@acme/business-logic/application/use-cases/todos/delete-todo.use-case";
import { getTodosForUserUseCase } from "@acme/business-logic/application/use-cases/todos/get-todos-for-user.use-case";
import { toggleTodoUseCase } from "@acme/business-logic/application/use-cases/todos/toggle-todo.use-case";
import { TodosRepository } from "@acme/db/repositories/todos.repository";
import { MockTodosRepository } from "@acme/db/repositories/todos.repository.mock";

import type {
  ConstructorParamsToDIKeys,
  FunctionParamsToDIKeys,
} from "~/di/type-safe-binding";
import { bulkUpdateController } from "~/controllers/todos/bulk-update.controller";
import { createTodoController } from "~/controllers/todos/create-todo.controller";
import { getTodosForUserController } from "~/controllers/todos/get-todos-for-user.controller";
import { toggleTodoController } from "~/controllers/todos/toggle-todo.controller";
import { DI_SYMBOLS } from "~/di/types";

export function createTodosModule() {
  const todosModule = createModule();

  // TODO: Add env config
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "test") {
    const dependenciesSymbols: ConstructorParamsToDIKeys<typeof MockTodosRepository> = [];

    todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(
      MockTodosRepository,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  } else {
    const dependenciesSymbols: ConstructorParamsToDIKeys<typeof TodosRepository> = [
      "IInstrumentationService",
      "ICrashReporterService",
    ];

    todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(
      TodosRepository,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  }

  const createTodoUseCaseDependenciesSymbols: FunctionParamsToDIKeys<
    typeof createTodoUseCase
  > = ["IInstrumentationService", "ITodosRepository"];

  todosModule.bind(DI_SYMBOLS.ICreateTodoUseCase).toHigherOrderFunction(
    createTodoUseCase,
    createTodoUseCaseDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const deleteTodoUseCaseDependenciesSymbols: FunctionParamsToDIKeys<
    typeof deleteTodoUseCase
  > = ["IInstrumentationService", "ITodosRepository"];

  todosModule.bind(DI_SYMBOLS.IDeleteTodoUseCase).toHigherOrderFunction(
    deleteTodoUseCase,
    deleteTodoUseCaseDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const getTodosForUserUseCaseDependenciesSymbols: FunctionParamsToDIKeys<
    typeof getTodosForUserUseCase
  > = ["IInstrumentationService", "ITodosRepository"];

  todosModule.bind(DI_SYMBOLS.IGetTodosForUserUseCase).toHigherOrderFunction(
    getTodosForUserUseCase,
    getTodosForUserUseCaseDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const toggleTodoUseCaseDependenciesSymbols: FunctionParamsToDIKeys<
    typeof getTodosForUserUseCase
  > = ["IInstrumentationService", "ITodosRepository"];

  todosModule.bind(DI_SYMBOLS.IToggleTodoUseCase).toHigherOrderFunction(
    toggleTodoUseCase,
    toggleTodoUseCaseDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const bulkUpdateControllerDependenciesSymbols: FunctionParamsToDIKeys<
    typeof bulkUpdateController
  > = [
    "IInstrumentationService",
    "ITransactionManagerService",
    "IToggleTodoUseCase",
    "IDeleteTodoUseCase",
  ];

  todosModule.bind(DI_SYMBOLS.IBulkUpdateController).toHigherOrderFunction(
    bulkUpdateController,
    bulkUpdateControllerDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const createTodoControllerDependenciesSymbols: FunctionParamsToDIKeys<
    typeof createTodoController
  > = ["IInstrumentationService", "ITransactionManagerService", "ICreateTodoUseCase"];

  todosModule.bind(DI_SYMBOLS.ICreateTodoController).toHigherOrderFunction(
    createTodoController,
    createTodoControllerDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const getTodosForUserControllerDependenciesSymbols: FunctionParamsToDIKeys<
    typeof getTodosForUserController
  > = ["IInstrumentationService", "IGetTodosForUserUseCase"];

  todosModule.bind(DI_SYMBOLS.IGetTodosForUserController).toHigherOrderFunction(
    getTodosForUserController,
    getTodosForUserControllerDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  const toggleTodoControllerDependenciesSymbols: FunctionParamsToDIKeys<
    typeof toggleTodoController
  > = ["IInstrumentationService", "IToggleTodoUseCase"];

  todosModule.bind(DI_SYMBOLS.IToggleTodoController).toHigherOrderFunction(
    toggleTodoController,
    toggleTodoControllerDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
  );

  return todosModule;
}
