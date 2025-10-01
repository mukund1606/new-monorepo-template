import { z } from "zod";

import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { ITransactionManagerService } from "@acme/business-logic/application/services/transaction-manager.service.interface";
import type { IDeleteTodoUseCase } from "@acme/business-logic/application/use-cases/todos/delete-todo.use-case";
import type { IToggleTodoUseCase } from "@acme/business-logic/application/use-cases/todos/toggle-todo.use-case";
import { InputParseError } from "@acme/business-logic/entities/errors/common";

const inputSchema = z.object({
  dirty: z.array(z.number()),
  deleted: z.array(z.number()),
});

export type IBulkUpdateController = ReturnType<typeof bulkUpdateController> & {
  __brand: "IBulkUpdateController";
};

export const bulkUpdateController =
  (
    instrumentationService: IInstrumentationService,
    transactionManagerService: ITransactionManagerService,
    toggleTodoUseCase: IToggleTodoUseCase,
    deleteTodoUseCase: IDeleteTodoUseCase,
  ) =>
  async (input: z.infer<typeof inputSchema>, userId: string): Promise<void> => {
    await instrumentationService.startSpan(
      {
        name: "bulkUpdate Controller",
      },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError("Invalid data", { cause: inputParseError });
        }

        const { dirty, deleted } = data;

        await instrumentationService.startSpan(
          { name: "Bulk Update Transaction" },
          async () => {
            await transactionManagerService.startTransaction(async (mainTx) => {
              try {
                await Promise.all(
                  dirty.map((t) => toggleTodoUseCase({ todoId: t }, userId, mainTx)),
                );
              } catch (err) {
                console.error(err);
                console.error("Rolling back toggles!");
                mainTx.rollback();
              }

              // Create a savepoint to avoid rolling back toggles if deletes fail
              await transactionManagerService.startTransaction(async (deleteTx) => {
                try {
                  await Promise.all(
                    deleted.map((t) =>
                      deleteTodoUseCase({ todoId: t }, userId, deleteTx),
                    ),
                  );
                } catch {
                  console.error("Rolling back deletes!");
                  deleteTx.rollback();
                }
              }, mainTx);
            });
          },
        );
      },
    );
  };
