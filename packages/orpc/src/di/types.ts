import type { ITodosRepository } from "@acme/business-logic/application/repositories/todos.repository.interface";
import type { IUsersRepository } from "@acme/business-logic/application/repositories/users.repository.interface";
import type { IAuthenticationService } from "@acme/business-logic/application/services/authentication.service.interface";
import type { ICrashReporterService } from "@acme/business-logic/application/services/crash-reporter.service.interface";
import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { ITransactionManagerService } from "@acme/business-logic/application/services/transaction-manager.service.interface";
import type { ICreateTodoUseCase } from "@acme/business-logic/application/use-cases/todos/create-todo.use-case";
import type { IDeleteTodoUseCase } from "@acme/business-logic/application/use-cases/todos/delete-todo.use-case";
import type { IGetTodosForUserUseCase } from "@acme/business-logic/application/use-cases/todos/get-todos-for-user.use-case";
import type { IToggleTodoUseCase } from "@acme/business-logic/application/use-cases/todos/toggle-todo.use-case";

import type { IBulkUpdateController } from "~/controllers/todos/bulk-update.controller";
import type { ICreateTodoController } from "~/controllers/todos/create-todo.controller";
import type { IGetTodosForUserController } from "~/controllers/todos/get-todos-for-user.controller";
import type { IToggleTodoController } from "~/controllers/todos/toggle-todo.controller";

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;

  // Use Cases
  ICreateTodoUseCase: ICreateTodoUseCase;
  IDeleteTodoUseCase: IDeleteTodoUseCase;
  IGetTodosForUserUseCase: IGetTodosForUserUseCase;
  IToggleTodoUseCase: IToggleTodoUseCase;

  // Controllers
  IBulkUpdateController: IBulkUpdateController;
  ICreateTodoController: ICreateTodoController;
  IGetTodosForUserController: IGetTodosForUserController;
  IToggleTodoController: IToggleTodoController;
}

type DT_KEYS = keyof DI_RETURN_TYPES;

export const DI_SYMBOLS: Record<DT_KEYS, symbol> = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),
  ITransactionManagerService: Symbol.for("ITransactionManagerService"),
  IInstrumentationService: Symbol.for("IInstrumentationService"),
  ICrashReporterService: Symbol.for("ICrashReporterService"),

  // Repositories
  ITodosRepository: Symbol.for("ITodosRepository"),
  IUsersRepository: Symbol.for("IUsersRepository"),

  // Use Cases
  ICreateTodoUseCase: Symbol.for("ICreateTodoUseCase"),
  IDeleteTodoUseCase: Symbol.for("IDeleteTodoUseCase"),
  IGetTodosForUserUseCase: Symbol.for("IGetTodosForUserUseCase"),
  IToggleTodoUseCase: Symbol.for("IToggleTodoUseCase"),

  // Controllers
  IBulkUpdateController: Symbol.for("IBulkUpdateController"),
  ICreateTodoController: Symbol.for("ICreateTodoController"),
  IGetTodosForUserController: Symbol.for("IGetTodosForUserController"),
  IToggleTodoController: Symbol.for("IToggleTodoController"),
};
