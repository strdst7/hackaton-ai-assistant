import { describe, it, expect } from "vitest";
import { parseScaffold } from "@/lib/ai/parse-scaffold";
import type { ScaffoldFile, Architecture } from "@/lib/ai/schemas";

// Helper: duplicate the parseArchitecture function for testing
// since it's defined inside ChatMessage.tsx
function parseArchitecture(content: string): Architecture | null {
  try {
    // Find JSON object starting with "components" key
    const startMatch = content.match(/\{\s*"components"/);
    if (!startMatch) return null;

    const startIdx = startMatch.index!;
    // Count braces to find matching closing } handling strings with braces
    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIdx = -1;

    for (let i = startIdx; i < content.length; i++) {
      const ch = content[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\" && inString) { escaped = true; continue; }
      if (ch === '"' && !escaped) { inString = !inString; continue; }
      if (!inString) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) { endIdx = i; break; }
        }
      }
    }

    if (endIdx === -1) return null;

    const jsonStr = content.substring(startIdx, endIdx + 1);
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.components || !Array.isArray(parsed.components)) return null;
    if (!parsed?.dataFlow || !parsed?.apiContracts || !parsed?.databaseSchema) return null;
    return parsed as Architecture;
  } catch {
    return null;
  }
}

describe("parseScaffold", () => {
  const validScaffold: ScaffoldFile[] = [
    {
      path: "src/app/page.tsx",
      content: "export default function Home() { return <div>Hello</div>; }",
      language: "typescript",
    },
    {
      path: "src/app/globals.css",
      content: "body { margin: 0; }",
      language: "css",
    },
  ];

  it("returns ScaffoldFile[] when content contains a valid scaffold JSON array", () => {
    const content = `Here is the project structure:\n${JSON.stringify(validScaffold)}\n\nLet me explain...`;
    const result = parseScaffold(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0].path).toBe("src/app/page.tsx");
    expect(result![0].language).toBe("typescript");
  });

  it("returns null when content has no JSON array", () => {
    const content = "This is just a regular message with no JSON.";
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON array does not match ScaffoldFile shape (missing path)", () => {
    const invalid = [{ name: "file.txt", content: "hello", language: "text" }];
    const content = `Some text ${JSON.stringify(invalid)} more text`;
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON array does not match ScaffoldFile shape (missing content)", () => {
    const invalid = [{ path: "file.txt", title: "hello", language: "text" }];
    const content = `Some text ${JSON.stringify(invalid)} more text`;
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON array does not match ScaffoldFile shape (missing language)", () => {
    const invalid = [{ path: "file.txt", content: "hello" }];
    const content = `Some text ${JSON.stringify(invalid)} more text`;
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });

  it("returns null for empty array", () => {
    const content = `Here is the scaffold: []`;
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });

  it("returns null for malicious JSON (prototype pollution)", () => {
    const malicious = '[{"__proto__": "polluted"}]';
    const content = `Data: ${malicious}`;
    const result = parseScaffold(content);
    // Should not crash, should return null (missing required fields)
    expect(result).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    const content = "Here is some scaffold: [{path: 'file.txt', content: 'hi', language: 'text'}]";
    // This is invalid JSON (single quotes)
    const result = parseScaffold(content);
    expect(result).toBeNull();
  });
});

describe("parseArchitecture", () => {
  const validArchitecture = {
    components: [
      { name: "ChatInterface", responsibility: "Handles user chat", communicatesWith: "ChatAction" },
      { name: "ChatAction", responsibility: "Processes messages", communicatesWith: "AIProvider" },
    ],
    dataFlow: "User sends message → ChatInterface → ChatAction → AIProvider → Response",
    apiContracts: [
      { endpoint: "POST /api/chat", description: "Send message", request: "{ content: string }", response: "{ reply: string }" },
    ],
    databaseSchema: "messages: { id, content, timestamp }",
    mermaidCode: "graph LR\nA[User] --> B[Chat]",
  };

  it("returns Architecture when content contains valid architecture JSON", () => {
    const content = `Here is the architecture:\n${JSON.stringify(validArchitecture)}\n\nLet me explain...`;
    const result = parseArchitecture(content);
    expect(result).not.toBeNull();
    expect(result!.components).toHaveLength(2);
    expect(result!.components[0].name).toBe("ChatInterface");
    expect(result!.dataFlow).toBe(validArchitecture.dataFlow);
    expect(result!.apiContracts).toHaveLength(1);
    expect(result!.databaseSchema).toBe(validArchitecture.databaseSchema);
    expect(result!.mermaidCode).toBe(validArchitecture.mermaidCode);
  });

  it("returns null when content has no architecture JSON object", () => {
    const content = "This is just a regular message with no JSON.";
    const result = parseArchitecture(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON object is missing required fields (no components)", () => {
    const invalid = { dataFlow: "flow", apiContracts: [], databaseSchema: "schema" };
    const content = `Data: ${JSON.stringify(invalid)}`;
    const result = parseArchitecture(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON object is missing required fields (no dataFlow)", () => {
    const invalid = { components: [], apiContracts: [], databaseSchema: "schema" };
    const content = `Data: ${JSON.stringify(invalid)}`;
    const result = parseArchitecture(content);
    expect(result).toBeNull();
  });

  it("returns null when JSON object has non-array components", () => {
    const invalid = { components: "not-an-array", dataFlow: "flow", apiContracts: [], databaseSchema: "schema" };
    const content = `Data: ${JSON.stringify(invalid)}`;
    const result = parseArchitecture(content);
    expect(result).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    const content = 'Architecture: {components: [{name: "Test"}]}';
    const result = parseArchitecture(content);
    expect(result).toBeNull();
  });

  it("returns null for empty string", () => {
    const result = parseArchitecture("");
    expect(result).toBeNull();
  });

  it("works when architecture JSON is embedded in longer text", () => {
    const content = `Here's the overview. ${JSON.stringify(validArchitecture)} That's all.`;
    const result = parseArchitecture(content);
    expect(result).not.toBeNull();
    expect(result!.components).toHaveLength(2);
  });
});