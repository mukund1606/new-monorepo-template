export interface ICrashReporterService {
  report(error: unknown): string;
}
