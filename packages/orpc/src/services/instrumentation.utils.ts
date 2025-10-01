/**
 * Dummy instrumentation utility that logs spans to console
 * Can be used by both real and mock implementations
 */
export function dummyStartSpan<T>(
  options: {
    name: string;
    op?: string;
    attributes?: Record<string, unknown>;
  },
  callback: () => T,
): T {
  const startTime = Date.now();
  const { name, op, attributes } = options;

  console.log(`[SPAN START] ${name}`, {
    operation: op,
    attributes,
    timestamp: new Date().toISOString(),
  });

  try {
    const result = callback();
    const duration = Date.now() - startTime;

    console.log(`[SPAN END] ${name}`, {
      duration: `${duration}ms`,
      status: "success",
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error(`[SPAN ERROR] ${name}`, {
      duration: `${duration}ms`,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

/**
 * Silent span utility for mocks that just executes the callback
 * without logging anything
 */
export function silentStartSpan<T>(
  _options: {
    name: string;
    op?: string;
    attributes?: Record<string, unknown>;
  },
  callback: () => T,
): T {
  return callback();
}
