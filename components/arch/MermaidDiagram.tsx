"use client";

import { useEffect, useRef, useState, useId, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface MermaidDiagramProps {
  code: string;
  title?: string;
}

export function MermaidDiagram({ code, title }: MermaidDiagramProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "-");

  useEffect(() => {
    let mounted = true;

    async function renderMermaid() {
      if (!containerRef.current || !code) return;

      setRenderError(false);

      try {
        const mermaid = await import("mermaid");
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "default",
        });

        // Clear previous content
        containerRef.current.innerHTML = `<div class="mermaid" id="${uniqueId}">${code}</div>`;

        await mermaid.default.run({
          nodes: [document.getElementById(uniqueId)!],
        });
      } catch {
        if (mounted) {
          setRenderError(true);
        }
      }
    }

    renderMermaid();

    return () => {
      mounted = false;
    };
  }, [code, uniqueId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {title || "Architecture Diagram"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            {showRaw ? "Show Diagram" : "Show Raw"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Copy diagram code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {showRaw ? (
        <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      ) : renderError || !code ? (
        <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      ) : (
        <div
          ref={containerRef}
          className="flex justify-center overflow-x-auto py-2"
        />
      )}
    </div>
  );
}