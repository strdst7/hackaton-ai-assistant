export interface IdeaGenerationContext {
  theme: string;
  constraints?: string;
  teamSize?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
}

export function buildIdeaPrompt(context: IdeaGenerationContext): string {
  return `
Hackathon Theme: ${context.theme}
${context.constraints ? `Constraints: ${context.constraints}` : ""}
${context.teamSize ? `Team Size: ${context.teamSize}` : ""}
${context.skillLevel ? `Skill Level: ${context.skillLevel}` : ""}

Generate 3-5 creative, feasible project ideas for this hackathon.
`.trim();
}

export interface StackContext {
  ideaTitle: string;
  ideaDescription: string;
  skillLevel: string;
  teamSize: number;
}

export function buildStackPrompt(context: StackContext): string {
  return `
Project: ${context.ideaTitle}
Description: ${context.ideaDescription}
Team Skill Level: ${context.skillLevel}
Team Size: ${context.teamSize}

Recommend a complete technology stack for this hackathon project.
`.trim();
}

export interface ScaffoldContext {
  ideaTitle: string;
  ideaDescription: string;
  stack: string;
}

export function buildScaffoldPrompt(context: ScaffoldContext): string {
  return `
Project: ${context.ideaTitle}
Description: ${context.ideaDescription}
Technology Stack: ${context.stack}

Generate a complete, runnable project scaffold for this hackathon project.
Include: package.json, tsconfig.json, .env.example, tailwind.config.js, next.config.js, Dockerfile, README.md, docker-compose.yml, and all project source files.
`.trim();
}

export interface ArchitectureContext {
  ideaTitle: string;
  ideaDescription: string;
  stack: string;
  scaffoldSummary: string;
}

export function buildArchitecturePrompt(context: ArchitectureContext): string {
  return `
Project: ${context.ideaTitle}
Description: ${context.ideaDescription}
Technology Stack: ${context.stack}
Scaffold Structure: ${context.scaffoldSummary}

Produce a comprehensive architecture overview for this hackathon project.
`.trim();
}