import type { ITransactionManagerService } from "@acme/business-logic/application/services/transaction-manager.service.interface";

import type { Transaction } from "~/client";
import { db } from "~/client";

export class TransactionManagerService implements ITransactionManagerService {
  public startTransaction<T>(
    clb: (tx: Transaction) => Promise<T>,
    parent?: Transaction,
  ): Promise<T> {
    const invoker = parent ?? db;
    return invoker.transaction(clb);
  }
}
