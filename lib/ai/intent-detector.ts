/**
 * Intent detection module for the chat route.
 * Separated from the route file so it can be tested independently
 * without violating Next.js route export restrictions.
 */

export type PromptIntent = "ideas" | "stack" | "refinement" | "scaffold" | "architecture" | "chat";

export function detectIntent(lastMessage: string, selectedIdea: string | null): PromptIntent {
  const lower = lastMessage.toLowerCase();

  // Idea reference guard — if referencing a specific idea (e.g., "idea #2"),
  // do NOT trigger scaffold/architecture even if keywords present
  const ideaRefPattern = /idea\s*#?\s*\d+/i;
  const isIdeaReference = ideaRefPattern.test(lower);

  // Scaffold detection — only if not referencing a specific idea
  if (
    !isIdeaReference &&
    (lower.includes("scaffold") ||
      lower.includes("file tree") ||
      lower.includes("project structure") ||
      lower.includes("file structure"))
  )
    return "scaffold";

  // Architecture detection — only if not referencing a specific idea
  if (
    !isIdeaReference &&
    (lower.includes("architecture") ||
      lower.includes("arch") ||
      lower.includes("components") ||
      lower.includes("data flow") ||
      lower.includes("api contracts") ||
      lower.includes("mermaid"))
  )
    return "architecture";

  // Refinement commands
  if (/refine|regenerate|combine/i.test(lower)) return "refinement";

  // Stack request
  if (
    lower.includes("stack") ||
    lower.includes("tech stack") ||
    lower.includes("recommend") ||
    lower.includes("what should i use")
  )
    return "stack";

  // Idea generation — check for idea/theme/project keywords
  // but NOT when referencing a specific idea (e.g., "idea #2")
  if (
    (lower.includes("idea") || lower.includes("theme") || lower.includes("project")) &&
    !isIdeaReference
  )
    return "ideas";

  return "chat";
}