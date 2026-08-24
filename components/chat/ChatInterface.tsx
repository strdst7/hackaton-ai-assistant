"use client";

import { useCallback } from "react";
import { useChatPersistence } from "@/lib/hooks/useChatPersistence";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TimeoutToast } from "@/components/TimeoutToast";
import { Trash2 } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import type { Idea } from "@/lib/ai/schemas";

export function ChatInterface() {
  const {
    messages,
    sendMessage,
    stop,
    status,
    clearHistory,
    error,
  } = useChatPersistence();

  const isLoading = status === "streaming" || status === "submitted";

  function getLastUserText(): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "user") {
        const textPart = m.parts?.find((p) => p.type === "text");
        if (textPart && "text" in textPart) return (textPart as { text: string }).text;
      }
    }
    return "";
  }

  function onSend(message: string) {
    if (!message.trim() || isLoading) return;
    sendMessage({
      text: message.trim(),
    });
  }

  const handleSelectIdea = useCallback(
    (idea: Idea, index: number) => {
      const text = `I'd like to select idea #${index + 1}: ${idea.title}`;
      sendMessage(
        { text },
        {
          body: {
            selectedIdea: JSON.stringify({
              index: index + 1,
              title: idea.title,
              description: idea.description,
              difficulty: idea.difficulty,
              estimatedHours: idea.estimatedHours,
              techHint: idea.techHint,
            }),
          },
        }
      );
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-full min-h-screen">
      <header className="border-b border-border p-4 flex items-center justify-between bg-background">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            PeakyBlindr — Hackathon AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Your AI co-pilot for hackathon preparation
          </p>
        </div>
        <div className="flex items-center gap-1">
          <DownloadButton
            content={messages.map((m) => {
              const text = (m.parts || [])
                .filter((p) => p.type === "text")
                .map((p) => ("text" in p ? (p as { text: string }).text : ""))
                .join("\n");
              return `## ${m.role === "user" ? "You" : "AI Coach"}\n\n${text}`;
            }).join("\n\n---\n\n")}
            filename={`hackathon-conversation-${new Date().toISOString().split("T")[0]}.md`}
            variant="icon"
            label="Download conversation"
          />
          <button
            onClick={clearHistory}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ErrorBoundary
        fallback={
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-4">
                An unexpected error occurred. Please refresh the page to continue.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Refresh page
              </button>
            </div>
          </div>
        }
      >
        <MessageList messages={messages} isLoading={isLoading} onSelectIdea={handleSelectIdea} />
      </ErrorBoundary>

      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-300">
            Error: {(error as Error).message || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      <TimeoutToast
        isLoading={isLoading}
        onAbort={stop}
        onResume={() => {
          const text = getLastUserText();
          if (text) {
            sendMessage({ text });
          }
        }}
      />

      <ChatInput
        onSend={onSend}
        onStop={stop}
        isLoading={isLoading}
        disabled={false}
      />
    </div>
  );
}