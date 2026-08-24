"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileTreeView } from "./FileTreeView";
import { FileContentView } from "./FileContentView";
import type { ScaffoldFile } from "@/lib/ai/schemas";

interface ScaffoldGeneratorProps {
  files: ScaffoldFile[];
}

export function ScaffoldGenerator({ files }: ScaffoldGeneratorProps) {
  const [allCopied, setAllCopied] = useState(false);

  const handleCopyAll = useCallback(() => {
    const allContent = files
      .map((f) => `// ${f.path}\n${f.content}`)
      .join("\n\n");

    navigator.clipboard.writeText(allContent).then(() => {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 1500);
    });
  }, [files]);

  if (!files || files.length === 0) return null;

  return (
    <div className="my-2 rounded-lg border border-border overflow-hidden">
      {/* Header bar with title and Copy All */}
      <div className="flex items-center justify-between bg-card px-4 py-2 border-b border-border">
        <span className="text-xs font-medium text-foreground uppercase tracking-wider">
          Generated Scaffold
        </span>
        <button
          type="button"
          onClick={handleCopyAll}
          className={cn(
            "flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors",
            "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
          title="Copy all files"
        >
          {allCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>

      {/* File tree overview */}
      <div className="px-4 py-3 border-b border-border/50">
        <FileTreeView files={files} />
      </div>

      {/* Consecutive file content blocks */}
      <div className="space-y-0.5">
        {files.map((file, i) => (
          <div key={`${file.path}-${i}`}>
            {i > 0 && <div className="h-0.5 bg-border/30" />}
            <div className="px-0">
              <FileContentView file={file} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}