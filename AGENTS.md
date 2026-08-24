# AGENTS.md — Hackathon AI Assistant

## Project Overview
**Hackathon AI Assistant** — Web-based AI chat assistant helping students prepare for hackathons (ideation → stack → scaffold → architecture).

**Core Value:** Students chat with an AI agent that guides them through hackathon preparation end-to-end.

**Stack:** Next.js 15, React 19, Tailwind 4, Vercel AI SDK 5, Groq/OpenRouter/Ollama, Vercel Hobby (free)

**Constraints:** $0 budget, free tiers only, no auth v1, deploy to Vercel, MIT license

---

## GSD Workflow Commands

### Planning & Execution
- `/gsd-plan-phase 1` — Create executable plan for Phase 1 (Foundation & Chat Core)
- `/gsd-execute-phase 1` — Execute Phase 1 plans
- `/gsd-discuss-phase 1` — Gather context and clarify approach for Phase 1
- `/gsd-ui-phase 1` — Generate UI design contract (Phase 1 has UI)
- `/gsd-transition 1` — Transition to Phase 2 after verification

### Code Quality
- `/gsd-code-review` — Review source files for bugs, security, quality
- `/gsd-code-review-fix` — Apply fixes from review findings
- `/gsd-verify-work` — Verify phase deliverables match goals

### Project Management
- `/gsd-map-codebase` — Refresh codebase analysis
- `/gsd-audit-milestone` — Audit milestone completion
- `/gsd-complete-milestone` — Complete current milestone

---

## Project Structure
```
.planning/
  PROJECT.md          # Project context, core value, constraints
  REQUIREMENTS.md     # v1/v2 requirements with REQ-IDs
  ROADMAP.md          # 4 phases, success criteria, coverage
  STATE.md            # Project memory, current position
  config.json         # GSD configuration (yolo, coarse, parallel, smart)
  research/
    SUMMARY.md        # Research synthesis (stack, features, pitfalls)
    STACK.md          # Technology stack with versions/rationale
    FEATURES.md       # Feature landscape (table stakes, differentiators)
    ARCHITECTURE.md   # Component boundaries, data flow, build order
    PITFALLS.md       # 21 domain-specific pitfalls with prevention
```

---

## Phase 1: Foundation & Chat Core (Current)
**Requirements:** CHAT-01/02/03, INFRA-01/02/03/04/05, DEPLOY-01/02

**Key Tasks:**
1. Next.js 15 + Tailwind 4 + AI SDK 5 project setup
2. Provider abstraction: Groq → OpenRouter → Ollama fallback
3. Streaming chat with `useChat` + sessionStorage persistence
4. Token-aware rate limiting + 10s timeout handling (8s toast)
5. Structured JSON logging + Zod schema registry + validation retry
6. Vercel deployment with `.env.example` and secrets

**Success Criteria:** All 10 criteria in ROADMAP.md Phase 1 must be TRUE

---

## Key Architectural Decisions
| Decision | Rationale |
|----------|-----------|
| Single agent v1 (not multi-agent) | ASAP timeline; validate core chat loop first |
| Next.js 15 Server Actions + AI SDK 5 | Streaming built-in, free Vercel deployment |
| Web chat only (no CLI) | Students prefer web; most accessible |
| Free tiers only | $0 constraint forces lean architecture |
| No auth v1 | Free tier + simplicity |
| Groq → OpenRouter → Ollama fallback | Resilience against rate limits/outages |
| Zod schemas as single source of truth | Type-safe structured output across server/client |

---

## Critical Pitfalls to Address in Phase 1
1. **Token-level rate limits** (Groq 100K TPD binds before 14.4K RPD) → Token-aware limiting + fallback chain
2. **Vercel 10s function timeout** → 8s warning toast + abort/resume + smaller default models
3. **Structured output on free models** → Use gpt-oss-120b/Gemini/DeepSeek; fallback to tool-use + Zod
4. **Conversation context loss** → Pass full history to streamText; inject phase context in system prompt
5. **Single-provider dependency** → Abstract provider interface; Vercel AI Gateway $5 credit

---

## Development Guidelines
- **Mode:** YOLO (auto-approve, just execute)
- **Granularity:** Coarse (3-5 phases)
- **Parallelization:** Enabled (independent plans run simultaneously)
- **Research:** Enabled before each phase
- **Plan Check:** Enabled (verify plans achieve goals)
- **Verifier:** Enabled (confirm deliverables match phase goals)
- **Model Profile:** Smart (two models: research/planning vs execution/verification)

---

## Next Step
Run `/gsd-plan-phase 1` to create the executable plan for Foundation & Chat Core.