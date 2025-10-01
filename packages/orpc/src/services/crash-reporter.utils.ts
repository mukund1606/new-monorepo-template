/**
 * Dummy crash reporter utility that logs errors to console
 * Can be used by both real and mock implementations
 */
export function dummyCrashReport(error: unknown): string {
  const errorId = `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  console.error("[CRASH REPORT]", {
    errorId,
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
  });

  return errorId;
}
