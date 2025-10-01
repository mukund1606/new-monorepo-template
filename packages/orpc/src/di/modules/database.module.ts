import { createModule } from "@evyweb/ioctopus";

import { TransactionManagerService } from "@acme/db/services/transaction-manager.service";
import { MockTransactionManagerService } from "@acme/db/services/transaction-manager.service.mock";

import type { ConstructorParamsToDIKeys } from "~/di/type-safe-binding";
import { DI_SYMBOLS } from "~/di/types";

export function createTransactionManagerModule() {
  const transactionManagerModule = createModule();

  // TODO: Add env config
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "test") {
    const dependenciesSymbols: ConstructorParamsToDIKeys<
      typeof MockTransactionManagerService
    > = [];

    transactionManagerModule.bind(DI_SYMBOLS.ITransactionManagerService).toClass(
      MockTransactionManagerService,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  } else {
    const dependenciesSymbols: ConstructorParamsToDIKeys<
      typeof TransactionManagerService
    > = [];

    transactionManagerModule.bind(DI_SYMBOLS.ITransactionManagerService).toClass(
      TransactionManagerService,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  }
  return transactionManagerModule;
}
