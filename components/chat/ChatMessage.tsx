"use client";

import { cn } from "@/lib/utils";
import type { UIMessage } from "@ai-sdk/react";
import { IdeasList } from "@/components/ideas/IdeasList";
import { StackDisplay } from "@/components/stack/StackDisplay";
import { ScaffoldGenerator } from "@/components/scaffold/ScaffoldGenerator";
import { ArchitectureGuide } from "@/components/arch/ArchitectureGuide";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkeletonCard } from "@/components/SkeletonCard";
import { SkeletonTree } from "@/components/SkeletonTree";
import { parseScaffold, stripScaffoldJson } from "@/lib/ai/parse-scaffold";
import type { Idea, Stack, ScaffoldFile, Architecture } from "@/lib/ai/schemas";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
  onSelectIdea?: (idea: Idea, index: number) => void;
}

function getMessageText(message: UIMessage): string {
  return (message.parts || [])
    .filter((p) => p.type === "text")
    .map((p) => ("text" in p ? (p as { text: string }).text : ""))
    .join("\n");
}

function parseIdeas(content: string): Idea[] | null {
  try {
    const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    if (!parsed[0]?.title || !parsed[0]?.oneLiner) return null;
    return parsed as Idea[];
  } catch {
    return null;
  }
}

function parseStack(content: string): Stack | null {
  try {
    const objMatch = content.match(/\{\s*"layers"[\s\S]*?\}/);
    if (!objMatch) return null;
    const parsed = JSON.parse(objMatch[0]);
    if (!parsed?.layers || !Array.isArray(parsed.layers)) return null;
    return parsed as Stack;
  } catch {
    return null;
  }
}

function parseArchitecture(content: string): Architecture | null {
  try {
    // Find JSON object starting with "components" key (architecture signature)
    const startMatch = content.match(/\{\s*"components"/);
    if (!startMatch) return null;

    const startIdx = startMatch.index!;
    // Brace-counter to handle braces inside string values
    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIdx = -1;

    for (let i = startIdx; i < content.length; i++) {
      const ch = content[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\" && inString) { escaped = true; continue; }
      if (ch === '"' && !escaped) { inString = !inString; continue; }
      if (!inString) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) { endIdx = i; break; }
        }
      }
    }

    if (endIdx === -1) return null;

    const jsonStr = content.substring(startIdx, endIdx + 1);
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.components || !Array.isArray(parsed.components)) return null;
    if (!parsed?.dataFlow || !parsed?.apiContracts || !parsed?.databaseSchema) return null;
    return parsed as Architecture;
  } catch {
    return null;
  }
}

export function ChatMessage({ message, isStreaming, onSelectIdea }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const rawContent = getMessageText(message);

  let ideas: Idea[] | null = null;
  let stack: Stack | null = null;
  let scaffold: ScaffoldFile[] | null = null;
  let architecture: Architecture | null = null;
  let displayContent = rawContent;

  if (isAssistant && rawContent && !isStreaming) {
    ideas = parseIdeas(rawContent);
    stack = parseStack(rawContent);
    scaffold = parseScaffold(rawContent);
    architecture = parseArchitecture(rawContent);

    if (ideas) {
      const jsonMatch = rawContent.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (jsonMatch) {
        displayContent = rawContent.replace(jsonMatch[0], "").trim();
      }
    }
    if (stack) {
      const objMatch = rawContent.match(/\{\s*"layers"[\s\S]*?\}/);
      if (objMatch) {
        displayContent = displayContent.replace(objMatch[0], "").trim();
      }
    }
    if (scaffold) {
      displayContent = stripScaffoldJson(displayContent);
    }
    if (architecture) {
      // Strip the architecture JSON from display content
      const startMatch = rawContent.match(/\{\s*"components"/);
      if (startMatch) {
        const startIdx = startMatch.index!;
        let depth = 0;
        let inString = false;
        let escaped = false;
        let endIdx = -1;
        for (let i = startIdx; i < rawContent.length; i++) {
          const ch = rawContent[i];
          if (escaped) { escaped = false; continue; }
          if (ch === "\\" && inString) { escaped = true; continue; }
          if (ch === '"' && !escaped) { inString = !inString; continue; }
          if (!inString) {
            if (ch === "{") depth++;
            else if (ch === "}") {
              depth--;
              if (depth === 0) { endIdx = i; break; }
            }
          }
        }
        if (endIdx !== -1) {
          displayContent = rawContent.replace(rawContent.substring(startIdx, endIdx + 1), "").trim();
        }
      }
    }
  }

  // Show skeleton loading when streaming and no content yet
  const showStreamingSkeleton = isStreaming && !rawContent && !ideas && !stack && !scaffold && !architecture && isAssistant;

  return (
    <div className={cn("flex w-full gap-3 p-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">
            {isUser ? "You" : isAssistant ? "AI Coach" : message.role}
          </span>
          {isStreaming && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Streaming...
            </span>
          )}
        </div>

        {/* Ideas section with skeleton and error boundary */}
        {showStreamingSkeleton ? (
          <SkeletonCard count={3} />
        ) : ideas && onSelectIdea ? (
          <ErrorBoundary fallback={<p className="text-sm text-muted-foreground">Failed to load ideas. Try again.</p>}>
            <IdeasList ideas={ideas} onSelectIdea={onSelectIdea} />
          </ErrorBoundary>
        ) : null}

        {/* Stack section with skeleton and error boundary */}
        {showStreamingSkeleton ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-32" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        ) : stack ? (
          <ErrorBoundary>
            <StackDisplay stack={stack} />
          </ErrorBoundary>
        ) : null}

        {/* Scaffold section with skeleton and error boundary */}
        {showStreamingSkeleton ? (
          <SkeletonTree />
        ) : scaffold ? (
          <ErrorBoundary>
            <ScaffoldGenerator files={scaffold} />
          </ErrorBoundary>
        ) : null}

        {/* Architecture section with skeleton and error boundary */}
        {showStreamingSkeleton ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-40" />
            <div className="h-20 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-40 bg-muted rounded" />
          </div>
        ) : architecture ? (
          <ErrorBoundary>
            <ArchitectureGuide architecture={architecture} />
          </ErrorBoundary>
        ) : null}

        {displayContent && (
          <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        )}

        {!displayContent && !ideas && !stack && !scaffold && (
          <p className="text-sm text-muted-foreground">{rawContent}</p>
        )}
      </div>
    </div>
  );
}