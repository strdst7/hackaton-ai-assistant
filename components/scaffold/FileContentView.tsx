"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScaffoldFile } from "@/lib/ai/schemas";

interface FileContentViewProps {
  file: ScaffoldFile;
}

export function FileContentView({ file }: FileContentViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [file.content]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-muted/50 px-3 py-1.5 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono font-bold truncate">{file.path}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded shrink-0 text-muted-foreground">
            {file.language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "shrink-0 p-1 rounded transition-colors",
            "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
          title="Copy file content"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Code block */}
      <pre
        className="text-xs font-mono bg-muted p-3 overflow-x-auto whitespace-pre-wrap m-0"
        data-language={file.language}
      >
        <code>{file.content}</code>
      </pre>
    </div>
  );
}