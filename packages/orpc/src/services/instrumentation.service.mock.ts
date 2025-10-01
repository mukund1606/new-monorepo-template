import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";

import { silentStartSpan } from "./instrumentation.utils";

export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, unknown> },
    callback: () => T,
  ): T {
    // Use silent span for mocks to avoid cluttering test output
    return silentStartSpan(options, callback);
  }
}
