import type { UIMessage } from "ai";

export interface ProviderConfig {
  groqApiKey?: string;
  openRouterApiKey?: string;
  ollamaBaseUrl?: string;
}

export interface ChatSession {
  id: string;
  messages: UIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface RateLimitState {
  tokensUsedToday: number;
  tokensLimit: number;
  lastResetDate: string;
}

export const DEFAULT_RATE_LIMITS = {
  GROQ_TOKENS_PER_DAY: 100_000,
  WARNING_THRESHOLD: 0.8,
  BLOCKING_THRESHOLD: 0.95,
} as const;