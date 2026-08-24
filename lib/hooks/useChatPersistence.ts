"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useCallback } from "react";
import type { UIMessage } from "@ai-sdk/react";

const STORAGE_KEY = "hackathon-assistant-chat-history";

export function useChatPersistence() {
  const chat = useChat({
    messages: loadMessagesFromStorage(),
    onError: (error) => {
      console.error("[Chat Error]", error);
    },
  });

  const { messages } = chat;

  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  const clearHistory = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    chat.setMessages([]);
  }, [chat]);

  return {
    ...chat,
    clearHistory,
  };
}

function loadMessagesFromStorage(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as UIMessage[];
  } catch {
    console.warn("Failed to load chat history from sessionStorage");
    return [];
  }
}

function saveMessagesToStorage(messages: UIMessage[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.warn(
      "Failed to save chat history to sessionStorage:",
      error instanceof Error ? error.message : String(error)
    );
  }
}