import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "./prompts";

describe("buildSystemPrompt", () => {
  describe("scaffold type", () => {
    it("returns scaffold system prompt with idea and stack context when both provided", () => {
      const result = buildSystemPrompt("scaffold", "My Cool Project", "Next.js, Firebase");
      expect(result).toContain("My Cool Project");
      expect(result).toContain("Next.js, Firebase");
      expect(result).toContain("Project context");
    });

    it("returns plain scaffold prompt when missing stack context", () => {
      const result = buildSystemPrompt("scaffold", "My Cool Project");
      expect(result).not.toContain("Project context");
      expect(result).toContain("code architect");
    });
  });

  describe("architecture type", () => {
    it("returns architecture system prompt with idea and stack context when both provided", () => {
      const result = buildSystemPrompt("architecture", "My Cool Project", "Next.js, Firebase");
      expect(result).toContain("My Cool Project");
      expect(result).toContain("Next.js, Firebase");
      expect(result).toContain("Project context");
    });

    it("returns plain architecture prompt when missing stack context", () => {
      const result = buildSystemPrompt("architecture", "My Cool Project");
      expect(result).not.toContain("Project context");
      expect(result).toContain("systems architect");
    });
  });

  describe("backward compatibility", () => {
    it("stack type with selected idea appends idea context", () => {
      const result = buildSystemPrompt("stack", "EduAI Tutor");
      expect(result).toContain("EduAI Tutor");
      expect(result).toContain("Selected project idea");
    });

    it("chat type returns plain chat prompt", () => {
      const result = buildSystemPrompt("chat");
      expect(result).toContain("Hackathon Coach");
      expect(result).not.toContain("Project context");
    });

    it("ideas type returns plain ideas prompt", () => {
      const result = buildSystemPrompt("ideas");
      expect(result).toContain("hackathon idea generator");
    });

    it("works with only type argument (no optional params)", () => {
      const result = buildSystemPrompt("chat");
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });
});