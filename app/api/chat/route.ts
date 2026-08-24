import { streamText, createTextStreamResponse, convertToCoreMessages } from "ai";
import { createProvider, withFallback } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { createRateLimiter } from "@/lib/rate-limiter";
import { createLogger } from "@/lib/logging";
import { detectIntent } from "@/lib/ai/intent-detector";
import type { CoreMessage } from "ai";
import type { PromptIntent } from "@/lib/ai/intent-detector";

export const maxDuration = 10;

const rateLimiter = createRateLimiter();
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0.7;

export async function POST(req: Request) {
  const logger = createLogger();
  const startTime = Date.now();

  try {
    const body = await req.json();
    const messages = body.messages;
    const selectedIdea: string | null = body.selectedIdea || null;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid request: messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      const content = lastMessage.content || "";
      if (content.length > 4000) {
        return new Response(JSON.stringify({ error: "Message exceeds 4000 characters" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const estimatedTokens = messages.reduce(
      (sum: number, m: any) => sum + Math.ceil((m.content || "").length / 4),
      0
    );

    const rateCheck = rateLimiter.check(estimatedTokens);
    if (rateCheck.shouldBlock) {
      logger.error(`Rate limit blocked: ${rateCheck.usagePercent}% used`);
      return new Response(
        JSON.stringify({
          error: `Daily token limit reached (${rateCheck.usagePercent}%). Try again tomorrow.`,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (rateCheck.shouldWarn) {
      console.warn(`Rate limit warning: ${rateCheck.usagePercent}% of daily tokens used`);
    }

    // Detect intent from the last user message
    const intent: PromptIntent = detectIntent(
      lastMessage?.content || "",
      selectedIdea
    );

    // Map refinement intent to ideas prompt (refinement reuses the ideas system prompt)
    const systemPromptType: "chat" | "ideas" | "stack" | "scaffold" | "architecture" =
      intent === "refinement" ? "ideas" : intent;

    // Adjust parameters based on intent
    const maxOutputTokens = intent === "ideas" || intent === "refinement" || intent === "scaffold" || intent === "architecture" ? 3072 : DEFAULT_MAX_TOKENS;
    const temperature = intent === "refinement" ? 0.6 : DEFAULT_TEMPERATURE;

    const providers = createProvider();

    const { result, providerName } = await withFallback(providers, async (provider) => {
      return streamText({
        model: provider.chatModel as any,
        system: buildSystemPrompt(systemPromptType, selectedIdea ?? undefined),
        messages: convertToCoreMessages(messages) as CoreMessage[],
        maxOutputTokens,
        temperature,
        onFinish: async ({ usage, finishReason }: any) => {
          const elapsed = Date.now() - startTime;
          if (usage) {
            rateLimiter.record(usage.totalTokens ?? 0);
          }
          logger.log({
            model: providerName,
            tokensIn: usage?.promptTokens ?? 0,
            tokensOut: usage?.completionTokens ?? 0,
            latencyMs: elapsed,
            finishReason: finishReason ?? null,
            error: null,
          });
        },
      });
    });

    const response = createTextStreamResponse({
      textStream: result.textStream as unknown as ReadableStream<string>,
      headers: {
        "X-Intent": intent,
      },
    });

    return response;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error(message, { latencyMs: elapsed });
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}