import type { ICrashReporterService } from "@acme/business-logic/application/services/crash-reporter.service.interface";

import { dummyCrashReport } from "./crash-reporter.utils";

export class CrashReporterService implements ICrashReporterService {
  report(error: unknown): string {
    return dummyCrashReport(error);
  }
}
