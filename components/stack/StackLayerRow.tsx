"use client";

import type { StackLayer } from "@/lib/ai/schemas";
import { ChevronRight } from "lucide-react";

interface StackLayerRowProps {
  layer: StackLayer;
  index: number;
}

export function StackLayerRow({ layer, index }: StackLayerRowProps) {
  return (
    <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0 border-b border-border/50 last:border-0">
      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {layer.layer}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {layer.technology}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {layer.justification}
        </p>
      </div>
    </div>
  );
}