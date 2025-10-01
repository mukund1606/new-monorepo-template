import { createModule } from "@evyweb/ioctopus";

import { AuthenticationService } from "@acme/auth/services/authentication.service";
import { MockAuthenticationService } from "@acme/auth/services/authentication.service.mock";

import type { ConstructorParamsToDIKeys } from "~/di/type-safe-binding";
import { DI_SYMBOLS } from "~/di/types";

export function createAuthenticationModule() {
  const authenticationModule = createModule();

  // TODO: Add env config
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "test") {
    const dependenciesSymbols: ConstructorParamsToDIKeys<
      typeof MockAuthenticationService
    > = [];

    authenticationModule.bind(DI_SYMBOLS.IAuthenticationService).toClass(
      MockAuthenticationService,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  } else {
    const dependenciesSymbols: ConstructorParamsToDIKeys<typeof AuthenticationService> = [
      "IInstrumentationService",
    ];

    authenticationModule.bind(DI_SYMBOLS.IAuthenticationService).toClass(
      AuthenticationService,
      dependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  }

  return authenticationModule;
}
