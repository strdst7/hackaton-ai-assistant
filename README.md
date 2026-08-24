# Hackathon AI Assistant

An AI-powered chat assistant that helps students prepare for and execute hackathon projects — from idea generation to deployment.

Live demo: [hackathon-ai-assistant.vercel.app](https://hackathon-ai-assistant.vercel.app)

## Features

- **Project Ideation** — Describe your hackathon theme and get 3-5 structured project ideas with difficulty ratings
- **Tech Stack Recommendations** — Opinionated 6-layer stack with per-layer justifications, all free-tier compatible
- **Code Scaffolding** — Generate a complete file tree with file contents, ready to run
- **Architecture Guidance** — Component diagrams, data flow, API contracts, DB schema with live Mermaid diagrams
- **Export** — Copy individual files, entire artifacts, or download the full conversation as Markdown

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TailwindCSS 4 |
| AI SDK | Vercel AI SDK 5 |
| LLM Provider | Groq (primary) → OpenRouter (fallback) |
| Deployment | Vercel (Hobby, free) |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY (get one at https://console.groq.com/keys)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

## Project Structure

```
app/              # Next.js App Router pages and API routes
components/       # React components (chat, ideas, stack, scaffold, architecture)
lib/              # Core logic (AI providers, schemas, prompts, rate limiter, logging)
```

## License

MIT