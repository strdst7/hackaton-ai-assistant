"use client";

import { StackLayerRow } from "./StackLayerRow";
import type { Stack } from "@/lib/ai/schemas";

interface StackDisplayProps {
  stack: Stack;
}

export function StackDisplay({ stack }: StackDisplayProps) {
  if (!stack?.layers || stack.layers.length === 0) return null;

  return (
    <div className="my-2 rounded-lg border border-border bg-card p-4 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Recommended Tech Stack
      </p>
      <div className="divide-y divide-border/50">
        {stack.layers.map((layer, i) => (
          <StackLayerRow key={`${layer.layer}-${i}`} layer={layer} index={i} />
        ))}
      </div>
      {stack.summary && (
        <p className="text-xs text-muted-foreground italic pt-1 border-t border-border/50 mt-1">
          {stack.summary}
        </p>
      )}
    </div>
  );
}