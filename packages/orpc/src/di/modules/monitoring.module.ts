import { createModule } from "@evyweb/ioctopus";

import type { ConstructorParamsToDIKeys } from "~/di/type-safe-binding";
import { DI_SYMBOLS } from "~/di/types";
import { CrashReporterService } from "~/services/crash-reporter.service";
import { MockCrashReporterService } from "~/services/crash-reporter.service.mock";
import { InstrumentationService } from "~/services/instrumentation.service";
import { MockInstrumentationService } from "~/services/instrumentation.service.mock";

export function createMonitoringModule() {
  const monitoringModule = createModule();

  // TODO: Add env config
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "test") {
    const instrumentationDependenciesSymbols: ConstructorParamsToDIKeys<
      typeof MockInstrumentationService
    > = [];

    const crashReporterDependenciesSymbols: ConstructorParamsToDIKeys<
      typeof MockCrashReporterService
    > = [];

    monitoringModule.bind(DI_SYMBOLS.IInstrumentationService).toClass(
      MockInstrumentationService,
      instrumentationDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );

    monitoringModule.bind(DI_SYMBOLS.ICrashReporterService).toClass(
      MockCrashReporterService,
      crashReporterDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  } else {
    const instrumentationDependenciesSymbols: ConstructorParamsToDIKeys<
      typeof InstrumentationService
    > = [];

    const crashReporterDependenciesSymbols: ConstructorParamsToDIKeys<
      typeof CrashReporterService
    > = [];

    monitoringModule.bind(DI_SYMBOLS.IInstrumentationService).toClass(
      InstrumentationService,
      instrumentationDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );

    monitoringModule.bind(DI_SYMBOLS.ICrashReporterService).toClass(
      CrashReporterService,
      crashReporterDependenciesSymbols.map((symbol) => DI_SYMBOLS[symbol]),
    );
  }

  return monitoringModule;
}
