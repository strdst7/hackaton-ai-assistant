export interface LogEntry {
  requestId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  finishReason: string | null;
  error: string | null;
  timestamp: string;
}

export function createLogger(requestId?: string) {
  const id = requestId || crypto.randomUUID();
  return {
    log(entry: Omit<LogEntry, "timestamp" | "requestId">) {
      const fullEntry: LogEntry = {
        ...entry,
        requestId: id,
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(fullEntry));
      return fullEntry;
    },
    error(message: string, meta?: Record<string, unknown>) {
      console.error(JSON.stringify({
        requestId: id,
        error: message,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    },
    getRequestId: () => id,
  };
}

export type Logger = ReturnType<typeof createLogger>;