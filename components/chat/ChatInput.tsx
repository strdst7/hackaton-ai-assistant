"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { SendHorizontal, Square } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 4000;

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  function validate(value: string): string | null {
    if (value.length > MAX_CHARS) {
      return `Message too long (${value.length}/${MAX_CHARS} characters)`;
    }
    if (/[<>{}\\]/.test(value)) {
      return "Message contains invalid characters";
    }
    if (value.trim().length === 0) {
      return "Message cannot be empty";
    }
    return null;
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const error = validate(input);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(value: string) {
    setInput(value);
    setValidationError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about hackathon ideas, tech stacks, or architecture..."
            rows={1}
            maxLength={MAX_CHARS + 100}
            disabled={disabled}
            className={cn(
              "w-full resize-none rounded-lg border px-3 py-2 text-sm",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isOverLimit && "border-red-500 focus:ring-red-500"
            )}
            aria-label="Chat message input"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <span
              className={cn(
                "text-xs",
                isOverLimit ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="rounded-lg p-2 bg-muted text-muted-foreground hover:bg-border transition-colors"
              aria-label="Stop streaming"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className={cn(
                "rounded-lg p-2 transition-colors",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {validationError && (
        <p className="text-xs text-red-500 mt-1 max-w-4xl mx-auto">
          {validationError}
        </p>
      )}
    </form>
  );
}