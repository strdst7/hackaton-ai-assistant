"use client";

import { IdeaCard } from "./IdeaCard";
import type { Idea } from "@/lib/ai/schemas";

interface IdeasListProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea, index: number) => void;
}

export function IdeasList({ ideas, onSelectIdea }: IdeasListProps) {
  if (ideas.length === 0) return null;

  return (
    <div className="space-y-3 my-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Project Ideas ({ideas.length})
      </p>
      <div className="grid gap-3">
        {ideas.map((idea, i) => (
          <IdeaCard
            key={`${i}-${idea.title}`}
            idea={idea}
            index={i}
            onSelect={onSelectIdea}
          />
        ))}
      </div>
    </div>
  );
}