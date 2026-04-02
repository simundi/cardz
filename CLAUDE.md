# Delegation Poker — Remote

## Stack
React 18 + Vite + TypeScript strict + React Router v6 + shadcn/ui + Tailwind

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`

## Before coding anything
1. Read `openspec/specs/` — understand the current system state
2. Read the relevant change in `openspec/changes/` — understand what you're building
3. Never implement something not described in a spec

## Architecture laws — never break these
- Layer order: pages → components → store → adapters → types
- NEVER call BroadcastChannel directly from components or pages
- NEVER use useState for session data — always useSession() hook
- NEVER import upward or skip layers

## Specs are the source of truth
- Coding standards: `openspec/specs/engineering-standards/spec.md`
- Domain rules: `openspec/specs/` (session-management, voting, sync, facilitation-flow)
- If code and spec disagree, fix the code — not the spec