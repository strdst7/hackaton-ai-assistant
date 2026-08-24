"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";
import type { Architecture } from "@/lib/ai/schemas";

const MermaidDiagram = dynamic(
  () => import("./MermaidDiagram").then((mod) => mod.MermaidDiagram),
  { ssr: false }
);

interface ArchitectureGuideProps {
  architecture: Architecture;
}

export function ArchitectureGuide({ architecture }: ArchitectureGuideProps) {
  const [copied, setCopied] = useState(false);

  const buildMarkdown = useCallback((): string => {
    const componentsMd = architecture.components
      .map(
        (c) =>
          `- **${c.name}**: ${c.responsibility} (talks to: ${c.communicatesWith})`
      )
      .join("\n");

    const apiContractsMd = architecture.apiContracts
      .map(
        (a) =>
          `### ${a.endpoint}\n- **Description**: ${a.description}\n- **Request**: ${a.request}\n- **Response**: ${a.response}`
      )
      .join("\n");

    const mermaidSection = architecture.mermaidCode
      ? `\n## Mermaid Diagram\n\n\`\`\`mermaid\n${architecture.mermaidCode}\n\`\`\``
      : "";

    return `# Architecture Overview

## Components
${componentsMd}

## Data Flow
${architecture.dataFlow}

## API Contracts
${apiContractsMd}

## Database Schema
${architecture.databaseSchema}${mermaidSection}`;
  }, [architecture]);

  const handleCopyAll = useCallback(() => {
    const md = buildMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [buildMarkdown]);

  return (
    <div className="my-2 rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-card px-4 py-2 border-b border-border">
        <span className="text-xs font-medium text-foreground uppercase tracking-wider">
          Architecture Overview
        </span>
        <button
          type="button"
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          title="Copy architecture as markdown"
        >
          {copied ? (
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

      <div className="p-4 space-y-4">
        {/* Components Section */}
        <section className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-2">Components</h3>
          <div className="grid gap-2">
            {architecture.components.map((comp, i) => (
              <div
                key={`comp-${i}`}
                className="rounded-lg border border-border p-3"
              >
                <p className="text-sm font-bold">{comp.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {comp.responsibility}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  Communicates with: {comp.communicatesWith}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Flow Section */}
        <section className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-2">Data Flow</h3>
          <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted/30 rounded-lg p-3">
            {architecture.dataFlow}
          </div>
        </section>

        {/* API Contracts Section */}
        <section className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-2">API Contracts</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-xs font-medium bg-muted/50 px-3 py-2 border-b border-border">
              <span>Endpoint</span>
              <span>Description</span>
              <span>Request</span>
              <span>Response</span>
            </div>
            {architecture.apiContracts.map((api, i) => (
              <div
                key={`api-${i}`}
                className="grid grid-cols-4 gap-0 text-xs px-3 py-2 border-b border-border last:border-b-0"
              >
                <span className="font-mono text-xs">{api.endpoint}</span>
                <span className="text-xs text-muted-foreground">
                  {api.description}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {api.request}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {api.response}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Database Schema Section */}
        <section className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-2">Database Schema</h3>
          <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
            <code>{architecture.databaseSchema}</code>
          </pre>
        </section>

        {/* Mermaid Diagram Section */}
        {architecture.mermaidCode && (
          <section>
            <MermaidDiagram code={architecture.mermaidCode} />
          </section>
        )}
      </div>
    </div>
  );
}