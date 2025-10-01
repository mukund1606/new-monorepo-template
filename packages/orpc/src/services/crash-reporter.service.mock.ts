import type { ICrashReporterService } from "@acme/business-logic/application/services/crash-reporter.service.interface";

import { dummyCrashReport } from "./crash-reporter.utils";

export class MockCrashReporterService implements ICrashReporterService {
  report(error: unknown): string {
    // Use the same dummy implementation for consistency in tests/mocks
    return dummyCrashReport(error);
  }
}
