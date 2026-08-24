"use client";

import { cn } from "@/lib/utils";
import type { Idea } from "@/lib/ai/schemas";
import { Clock, Sparkles } from "lucide-react";

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onSelect: (idea: Idea, index: number) => void;
}

const difficultyColors = {
  beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  advanced:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
};

export function IdeaCard({ idea, index, onSelect }: IdeaCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-3",
        "hover:border-primary/50 transition-colors"
      )}
    >
      {/* Header: idea number + difficulty badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              #{index + 1}
            </span>
            <h3 className="font-semibold text-sm text-card-foreground leading-tight">
              {idea.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            {idea.oneLiner}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border",
            difficultyColors[idea.difficulty]
          )}
        >
          {idea.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {idea.description}
      </p>

      {/* Footer: meta + select */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {idea.estimatedHours}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {idea.techHint}
          </span>
        </div>
        <button
          onClick={() => onSelect(idea, index)}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 active:bg-primary/80"
          )}
        >
          Select this idea
        </button>
      </div>
    </div>
  );
}