import type { ITransactionManagerService } from "@acme/business-logic/application/services/transaction-manager.service.interface";
import type { ITransaction } from "@acme/business-logic/entities/models/transaction.interface";

export class MockTransactionManagerService implements ITransactionManagerService {
  public startTransaction<T>(clb: (tx: ITransaction) => Promise<T>): Promise<T> {
    return clb({
      rollback: () => {
        /* empty */
      },
    });
  }
}
