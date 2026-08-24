"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScaffoldFile } from "@/lib/ai/schemas";

interface FileTreeViewProps {
  files: ScaffoldFile[];
}

interface TreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children: TreeNode[];
}

function buildTree(files: ScaffoldFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        // It's a file
        currentLevel.push({
          name: part,
          type: "file",
          path: file.path,
          children: [],
        });
      } else {
        // It's a folder — find or create
        let existing = currentLevel.find(
          (node) => node.type === "folder" && node.name === part
        );
        if (!existing) {
          existing = {
            name: part,
            type: "folder",
            path: parts.slice(0, i + 1).join("/"),
            children: [],
          };
          currentLevel.push(existing);
        }
        currentLevel = existing.children;
      }
    }
  }

  return root;
}

function FileTreeNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children.length > 0;

  if (node.type === "file") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 py-0.5 px-1 rounded-sm",
          "hover:bg-muted/50 transition-colors cursor-default"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="text-xs font-mono text-muted-foreground truncate">
          {node.name}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 py-0.5 px-1 rounded-sm w-full text-left",
          "hover:bg-muted/50 transition-colors"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="h-3.5 w-3.5 shrink-0" />
        )}
        <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="text-xs font-mono font-medium truncate">{node.name}</span>
      </button>
      {isExpanded &&
        node.children.map((child, i) => (
          <FileTreeNode key={`${child.path}-${i}`} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function FileTreeView({ files }: FileTreeViewProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  if (tree.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Project Structure
      </p>
      <div className="space-y-0.5">
        {tree.map((node, i) => (
          <FileTreeNode key={`${node.path}-${i}`} node={node} />
        ))}
      </div>
    </div>
  );
}