"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import type { UIMessage } from "@ai-sdk/react";
import type { Idea } from "@/lib/ai/schemas";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  onSelectIdea?: (idea: Idea, index: number) => void;
}

export function MessageList({ messages, isLoading, onSelectIdea }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Welcome to Hackathon AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              I&apos;ll help you go from blank page to hackathon-ready project —
              generating ideas, choosing a tech stack, scaffolding code, and
              designing architecture. All in one conversation.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Get started with:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <SuggestionButton
                label="Generate project ideas"
                description="Tell me your hackathon theme"
              />
              <SuggestionButton
                label="Ask about tech stacks"
                description="Compare frontend/backend options"
              />
              <SuggestionButton
                label="Scaffold a project"
                description="Generate starter code structure"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

function SuggestionButton({ label, description }: { label: string; description: string }) {
  return (
    <button
      type="button"
      className="inline-flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left text-xs"
    >
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{description}</span>
    </button>
  );
}

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
          onSelectIdea={onSelectIdea}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}