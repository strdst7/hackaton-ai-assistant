import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";

export interface AiProvider {
  chatModel: ReturnType<OpenAIProvider["chat"]>;
  name: string;
}

export interface ProviderResult {
  provider: AiProvider;
  fallbacks: AiProvider[];
  name: string;
}

export function createProvider(): ProviderResult {
  const groqApiKey = process.env.GROQ_API_KEY;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  const groqProvider = createOpenAI({
    apiKey: groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
    compatibility: "strict",
  });

  const openRouterProvider = createOpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    compatibility: "strict",
    headers: {
      "HTTP-Referer": "https://hackathon-ai-assistant.vercel.app",
      "X-Title": "Hackathon AI Assistant",
    },
  });

  if (groqApiKey) {
    return {
      provider: {
        chatModel: groqProvider("llama-3.3-70b-versatile"),
        name: "groq",
      },
      fallbacks: openRouterApiKey
        ? [{
            chatModel: openRouterProvider("meta-llama/llama-3.3-70b-instruct:free"),
            name: "openrouter",
          }]
        : [],
      name: "groq",
    };
  }

  if (openRouterApiKey) {
    return {
      provider: {
        chatModel: openRouterProvider("meta-llama/llama-3.3-70b-instruct:free"),
        name: "openrouter",
      },
      fallbacks: [],
      name: "openrouter",
    };
  }

  throw new Error(
    "No LLM provider configured. Set GROQ_API_KEY or OPENROUTER_API_KEY in your .env file."
  );
}

export async function withFallback<T>(
  providers: ProviderResult,
  fn: (provider: AiProvider) => Promise<T>
): Promise<{ result: T; providerName: string }> {
  const allProviders = [providers.provider, ...providers.fallbacks];

  for (const provider of allProviders) {
    try {
      const result = await fn(provider);
      return { result, providerName: provider.name };
    } catch (error) {
      const isLast = provider === allProviders[allProviders.length - 1];
      if (isLast) throw error;
      console.warn(
        `Provider "${provider.name}" failed, falling back:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  throw new Error("All providers exhausted");
}