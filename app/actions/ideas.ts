"use server";
import { streamText } from "ai";
import { createProvider, withFallback } from "@/lib/ai/providers";
import { IDEA_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { buildIdeaPrompt } from "@/lib/ai/prompt-templates";
import { createRateLimiter } from "@/lib/rate-limiter";
import { createLogger } from "@/lib/logging";
import type { IdeaGenerationContext } from "@/lib/ai/prompt-templates";

const rateLimiter = createRateLimiter();

export async function generateIdeas(context: IdeaGenerationContext) {
  const logger = createLogger();
  const startTime = Date.now();

  const estimatedTokens = 1000;
  const rateCheck = rateLimiter.check(estimatedTokens);
  if (rateCheck.shouldBlock) {
    logger.error(`Rate limit blocked for idea generation: ${rateCheck.usagePercent}% used`);
    return { error: `Daily token limit reached (${rateCheck.usagePercent}%). Try again tomorrow.` };
  }

  const providers = createProvider();
  const userPrompt = buildIdeaPrompt(context);

  try {
    const { result, providerName } = await withFallback(providers, async (provider) => {
      return streamText({
        model: provider.chatModel as any,
        system: IDEA_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        maxOutputTokens: 2048,
        temperature: 0.8,
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
    const message = error instanceof Error ? error.message : "Idea generation failed";
    logger.error(message, { action: "generateIdeas", latencyMs: Date.now() - startTime });
    return { error: message };
  }
}