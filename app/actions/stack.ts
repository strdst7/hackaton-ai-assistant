"use server";
import { streamText } from "ai";
import { createProvider, withFallback } from "@/lib/ai/providers";
import { STACK_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { buildStackPrompt } from "@/lib/ai/prompt-templates";
import { createRateLimiter } from "@/lib/rate-limiter";
import { createLogger } from "@/lib/logging";
import type { StackContext } from "@/lib/ai/prompt-templates";

const rateLimiter = createRateLimiter();

export async function generateStack(context: StackContext) {
  const logger = createLogger();
  const startTime = Date.now();

  const estimatedTokens = 1500;
  const rateCheck = rateLimiter.check(estimatedTokens);
  if (rateCheck.shouldBlock) {
    logger.error(`Rate limit blocked for stack generation: ${rateCheck.usagePercent}% used`);
    return { error: `Daily token limit reached (${rateCheck.usagePercent}%). Try again tomorrow.` };
  }

  const providers = createProvider();
  const userPrompt = buildStackPrompt(context);

  try {
    const { result, providerName } = await withFallback(providers, async (provider) => {
      return streamText({
        model: provider.chatModel as any,
        system: STACK_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        maxOutputTokens: 2048,
        temperature: 0.7,
        onFinish: async ({ usage }: any) => {
          if (usage) rateLimiter.record(usage.totalTokens ?? 0);
          logger.log({
            model: providerName,
            tokensIn: usage?.promptTokens ?? 0,
            tokensOut: usage?.completionTokens ?? 0,
            latencyMs: Date.now() - startTime,
            finishReason: "stop",
            error: null,
          });
        },
      });
    });

    return { textStream: result.textStream, providerName };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stack generation failed";
    logger.error(message, { action: "generateStack", latencyMs: Date.now() - startTime });
    return { error: message };
  }
}