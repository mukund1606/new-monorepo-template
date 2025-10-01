import { createModule } from "@evyweb/ioctopus";

import { UsersRepository } from "@acme/db/repositories/users.repository";
import { MockUsersRepository } from "@acme/db/repositories/users.repository.mock";

import type { ConstructorParamsToDIKeys } from "~/di/type-safe-binding";
import { DI_SYMBOLS } from "~/di/types";

export function createUsersModule() {
  const usersModule = createModule();

  // TODO: Add env config
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "test") {
    const dependenciesSymbols: ConstructorParamsToDIKeys<typeof MockUsersRepository> = [];

    usersModule.bind(DI_SYMBOLS.IUsersRepository).toClass(
      MockUsersRepository,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  } else {
    const dependenciesSymbols: ConstructorParamsToDIKeys<typeof UsersRepository> = [];

    usersModule.bind(DI_SYMBOLS.IUsersRepository).toClass(
      UsersRepository,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  }

  return usersModule;
}
