import { DEFAULT_RATE_LIMITS } from "@/lib/types";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  usagePercent: number;
  shouldWarn: boolean;
  shouldBlock: boolean;
}

export function createRateLimiter(
  options: {
    tokensPerDay?: number;
    warningThreshold?: number;
    blockingThreshold?: number;
  } = {}
) {
  const tokensPerDay = options.tokensPerDay ?? DEFAULT_RATE_LIMITS.GROQ_TOKENS_PER_DAY;
  const warningThreshold = options.warningThreshold ?? DEFAULT_RATE_LIMITS.WARNING_THRESHOLD;
  const blockingThreshold = options.blockingThreshold ?? DEFAULT_RATE_LIMITS.BLOCKING_THRESHOLD;

  let tokensUsedToday = 0;
  let currentDate = new Date().toDateString();

  function resetIfNewDay(): void {
    const today = new Date().toDateString();
    if (today !== currentDate) {
      tokensUsedToday = 0;
      currentDate = today;
    }
  }

  return {
    check(tokenCount: number): RateLimitResult {
      resetIfNewDay();
      const projectedUsage = tokensUsedToday + tokenCount;
      const usagePercent = projectedUsage / tokensPerDay;

      return {
        allowed: usagePercent < blockingThreshold,
        remaining: Math.max(0, tokensPerDay - projectedUsage),
        limit: tokensPerDay,
        usagePercent: Math.round(usagePercent * 100),
        shouldWarn: usagePercent >= warningThreshold && usagePercent < blockingThreshold,
        shouldBlock: usagePercent >= blockingThreshold,
      };
    },

    record(tokenCount: number): void {
      resetIfNewDay();
      tokensUsedToday += tokenCount;
    },

    getStats(): { tokensUsedToday: number; tokensPerDay: number; percentUsed: number } {
      resetIfNewDay();
      return {
        tokensUsedToday,
        tokensPerDay,
        percentUsed: Math.round((tokensUsedToday / tokensPerDay) * 100),
      };
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;