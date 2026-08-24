import type { ScaffoldFile } from "./schemas";

/**
 * Parses scaffold file data from assistant message content.
 * Looks for a JSON array of { path, content, language } objects
 * embedded in the message text.
 */
export function parseScaffold(content: string): ScaffoldFile[] | null {
  try {
    // Look for JSON array pattern with path/content/language objects
    const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (!arrayMatch) return null;
    const parsed = JSON.parse(arrayMatch[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    // Validate first element has required fields
    if (!parsed[0]?.path || !parsed[0]?.content || !parsed[0]?.language)
      return null;
    return parsed as ScaffoldFile[];
  } catch {
    return null;
  }
}

/**
 * Strips the first JSON array matching scaffold-like pattern from content.
 * Returns the trimmed text with the JSON removed.
 */
export function stripScaffoldJson(content: string): string {
  const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
  if (arrayMatch) {
    return content.replace(arrayMatch[0], "").trim();
  }
  return content;
}