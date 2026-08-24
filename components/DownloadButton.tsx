"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  content: string;
  filename: string;
  label?: string;
  variant?: "default" | "icon";
}

export function buildArtifactFilename(type: string): string {
  const sanitized = type.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${sanitized || "artifact"}.md`;
}

export function DownloadButton({
  content,
  filename,
  label = "Download",
  variant = "default",
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1500);
  }, [content, filename]);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        aria-label={label}
        title={label}
      >
        <Download className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Download className="h-4 w-4" />
      <span>{downloading ? "Downloading..." : label}</span>
    </button>
  );
}