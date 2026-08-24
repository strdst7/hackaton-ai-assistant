import { describe, it, expect } from "vitest";
import {
  buildIdeaPrompt,
  buildStackPrompt,
  buildScaffoldPrompt,
  buildArchitecturePrompt,
} from "./prompt-templates";
import type { ArchitectureContext } from "./prompt-templates";

describe("prompt-templates", () => {
  describe("buildScaffoldPrompt", () => {
    it("returns a prompt containing the idea title, description, and stack", () => {
      const result = buildScaffoldPrompt({
        ideaTitle: "EduAI Tutor",
        ideaDescription: "An AI tutor for students",
        stack: "Next.js, PostgreSQL, Tailwind",
      });
      expect(result).toContain("EduAI Tutor");
      expect(result).toContain("An AI tutor for students");
      expect(result).toContain("Next.js, PostgreSQL, Tailwind");
    });

    it("returns a prompt that asks for a complete project scaffold", () => {
      const result = buildScaffoldPrompt({
        ideaTitle: "Test",
        ideaDescription: "Test",
        stack: "React",
      });
      expect(result.toLowerCase()).toContain("scaffold");
      expect(result.toLowerCase()).toContain("runnable");
    });
  });

  describe("buildArchitecturePrompt", () => {
    it("includes idea title, description, stack, and scaffold summary", () => {
      const context: ArchitectureContext = {
        ideaTitle: "EduAI Tutor",
        ideaDescription: "An AI tutor",
        stack: "Next.js, PostgreSQL",
        scaffoldSummary: "src/app, src/components, package.json, tsconfig.json",
      };
      const result = buildArchitecturePrompt(context);
      expect(result).toContain("EduAI Tutor");
      expect(result).toContain("An AI tutor");
      expect(result).toContain("Next.js, PostgreSQL");
      expect(result).toContain("src/app, src/components, package.json, tsconfig.json");
    });

    it("asks for comprehensive architecture overview", () => {
      const result = buildArchitecturePrompt({
        ideaTitle: "Test",
        ideaDescription: "Test",
        stack: "React",
        scaffoldSummary: "files",
      });
      expect(result.toLowerCase()).toContain("architecture");
      expect(result.toLowerCase()).toContain("overview");
    });
  });

  describe("existing templates unchanged", () => {
    it("buildIdeaPrompt still works", () => {
      const result = buildIdeaPrompt({
        theme: "AI for education",
        constraints: "48 hours",
        teamSize: 3,
        skillLevel: "intermediate",
      });
      expect(result).toContain("AI for education");
      expect(result).toContain("48 hours");
    });

    it("buildStackPrompt still works", () => {
      const result = buildStackPrompt({
        ideaTitle: "EduAI",
        ideaDescription: "AI tutor",
        skillLevel: "intermediate",
        teamSize: 3,
      });
      expect(result).toContain("EduAI");
      expect(result).toContain("AI tutor");
    });
  });
});