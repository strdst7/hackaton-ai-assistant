import { describe, it, expect } from "vitest";
import { detectIntent } from "@/lib/ai/intent-detector";

describe("detectIntent", () => {
  it("returns 'chat' for general messages without scaffold/architecture keywords", () => {
    expect(detectIntent("i need help with my hackathon", null)).toBe("chat");
    expect(detectIntent("hello", null)).toBe("chat");
    expect(detectIntent("what is a hackathon", null)).toBe("chat");
  });

  it("returns 'chat' for idea references (idea #2, idea 3) even with scaffold/architecture keywords", () => {
    expect(detectIntent("show me idea #2 scaffold", null)).toBe("chat");
    expect(detectIntent("idea #3 architecture", null)).toBe("chat");
    expect(detectIntent("idea 1 scaffold", null)).toBe("chat");
  });

  it("returns 'scaffold' when message contains 'scaffold' keyword", () => {
    expect(detectIntent("generate a scaffold", null)).toBe("scaffold");
    expect(detectIntent("scaffold my project", null)).toBe("scaffold");
    expect(detectIntent("can you scaffold this", null)).toBe("scaffold");
  });

  it("returns 'scaffold' for 'file tree' or 'project structure' or 'file structure'", () => {
    expect(detectIntent("show me the file tree", null)).toBe("scaffold");
    expect(detectIntent("what is the project structure", null)).toBe("scaffold");
    expect(detectIntent("show me the file structure", null)).toBe("scaffold");
  });

  it("returns 'architecture' when message contains 'architecture' keyword", () => {
    expect(detectIntent("what does the architecture look like", null)).toBe("architecture");
    expect(detectIntent("architecture overview", null)).toBe("architecture");
    expect(detectIntent("show me the architecture", null)).toBe("architecture");
  });

  it("returns 'architecture' for 'components', 'data flow', 'api contracts', 'mermaid'", () => {
    expect(detectIntent("how do the components connect", null)).toBe("architecture");
    expect(detectIntent("what is the data flow", null)).toBe("architecture");
    expect(detectIntent("show me the api contracts", null)).toBe("architecture");
    expect(detectIntent("can you draw a mermaid diagram", null)).toBe("architecture");
  });

  it("returns 'architecture' for 'arch' abbreviation", () => {
    expect(detectIntent("what is the arch", null)).toBe("architecture");
    expect(detectIntent("show me the arch diagram", null)).toBe("architecture");
  });

  it("still returns 'stack' for stack-related messages", () => {
    expect(detectIntent("recommend a tech stack", null)).toBe("stack");
    expect(detectIntent("what should i use", null)).toBe("stack");
  });

  it("still returns 'ideas' for idea generation messages", () => {
    expect(detectIntent("give me project ideas", null)).toBe("ideas");
    expect(detectIntent("my theme is education", null)).toBe("ideas");
  });

  it("still returns 'refinement' for refine commands", () => {
    expect(detectIntent("refine idea #2", null)).toBe("refinement");
    expect(detectIntent("regenerate", null)).toBe("refinement");
  });
});