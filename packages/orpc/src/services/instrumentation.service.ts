import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";

import { dummyStartSpan } from "./instrumentation.utils";

export class InstrumentationService implements IInstrumentationService {
  startSpan<T>(
    options: {
      name: string;
      op?: string;
      attributes?: Record<string, unknown>;
    },
    callback: () => T,
  ): T {
    return dummyStartSpan(options, callback);
  }
}
