import { z } from "zod";

export const MessageInputSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message cannot exceed 4000 characters")
    .refine(
      (val) => !/[<>{}\\]/.test(val),
      "Message contains invalid characters (injection patterns)"
    ),
});

export type MessageInput = z.infer<typeof MessageInputSchema>;

export const IdeaSchema = z.object({
  title: z.string().describe("Catchy project name (1-6 words)"),
  oneLiner: z.string().describe("One-sentence pitch under 20 words"),
  description: z.string().describe("2-3 sentence description of what the project does"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level"),
  estimatedHours: z.string().describe("Rough time estimate, e.g. '8-12 hours' or 'weekend project'"),
  techHint: z.string().describe("Brief technology suggestion, e.g. 'React Native + Firebase'"),
});

export const IdeasArraySchema = z.array(IdeaSchema);
export type Idea = z.infer<typeof IdeaSchema>;

export const StackLayerSchema = z.object({
  layer: z.string().describe("Layer name: Frontend, Backend, Database, Auth, Deployment, AI/ML"),
  technology: z.string().describe("Recommended technology, e.g. 'Next.js 15'"),
  justification: z.string().describe("One-sentence why this technology fits the project"),
});
export type StackLayer = z.infer<typeof StackLayerSchema>;

export const StackSchema = z.object({
  layers: z.array(StackLayerSchema).min(3).max(8),
  summary: z.string().describe("One-paragraph summary of the stack recommendation"),
});

export type Stack = z.infer<typeof StackSchema>;

export const FileSchema = z.object({
  path: z.string().describe("File path relative to project root, e.g. 'src/app/page.tsx'"),
  content: z.string().describe("Complete file contents as a string"),
  language: z.string().describe("Programming language identifier, e.g. 'typescript', 'css'"),
});

export const FilesArraySchema = z.array(FileSchema);
export type ScaffoldFile = z.infer<typeof FileSchema>;

export const ComponentSchema = z.object({
  name: z.string().describe("Component name, e.g. 'ChatInterface'"),
  responsibility: z.string().describe("One-sentence responsibility"),
  communicatesWith: z.string().describe("What this component talks to, e.g. 'ChatAction'"),
});

export const ApiContractSchema = z.object({
  endpoint: z.string().describe("API endpoint path, e.g. 'POST /api/messages'"),
  description: z.string().describe("What this endpoint does"),
  request: z.string().describe("Request shape, e.g. '{ content: string }'"),
  response: z.string().describe("Response shape, e.g. '{ message: Message }'"),
});

export const ArchitectureSchema = z.object({
  components: z.array(ComponentSchema).min(2).max(15),
  dataFlow: z.string().describe("Description of how data flows through the system"),
  apiContracts: z.array(ApiContractSchema).min(1).max(10),
  databaseSchema: z.string().describe("Outline of database tables/collections needed"),
  mermaidCode: z.string().optional().describe("Optional Mermaid diagram code"),
});

export type Architecture = z.infer<typeof ArchitectureSchema>;