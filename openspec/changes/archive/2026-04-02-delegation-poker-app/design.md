## Context

Greenfield project. No existing code — we're building the foundational scaffold for a Delegation Poker remote facilitation tool. The stack is React 18 + Vite + TypeScript (strict) + React Router v6 with no external state libraries.

This change covers only the skeleton: project setup, routing, state types + reducer, and the SyncAdapter abstraction. Feature UI and game logic come in subsequent changes.

## Goals / Non-Goals

**Goals:**
- Clean project scaffold with strict TypeScript and proper directory structure
- SyncAdapter abstraction that makes transport swappable
- Session state model (types + reducer + Context) ready for feature work
- Route stubs for home, host, and play views
- Vanilla CSS with design tokens following shadcn/ui conventions

**Non-Goals:**
- Any feature UI (voting cards, scenario management, results display)
- Complete reducer actions (only foundational ones: create-session, join, participant-left)
- Supabase adapter (v1)
- Authentication, persistence, or mobile optimization

## Decisions

### 1. State management: useReducer + Context (not Redux/Zustand)

The session state is a single reducer with well-defined actions. No need for external libraries. The reducer is the single source of truth; the sync adapter dispatches actions received from other tabs.

**Alternatives considered:** Redux (overkill for this scope), Zustand (nice but adds dependency), jotai (atomic model doesn't fit session-as-a-unit pattern).

### 2. SyncAdapter interface with LocalAdapter (BroadcastChannel)

```
interface SyncAdapter {
  join(sessionId: string, role: Role): void
  send(action: SessionAction): void
  onReceive(callback: (action: SessionAction) => void): void
  leave(): void
}
```

LocalAdapter implements this via BroadcastChannel. Every action dispatched locally is also broadcast. Received actions are dispatched into the local reducer. This keeps sync logic completely separate from UI.

**Alternatives considered:** Shared worker (more complex, no benefit for v0.1), direct postMessage (BroadcastChannel is cleaner for multi-tab).

### 3. Session identification via short codes

Facilitator creates a session and gets a 6-character alphanumeric code. Participants enter this code to join. For v0.1 with BroadcastChannel, the code doubles as the channel name.

**Alternatives considered:** UUID (harder to share verbally), URL-based (requires routing complexity upfront).

### 4. Routing structure

```
/                  → Home (placeholder)
/session/:id/host  → Facilitator view (placeholder)
/session/:id/play  → Participant view (placeholder)
```

React Router v6 with a SessionProvider context wrapping the session routes.

## Risks / Trade-offs

- **BroadcastChannel is same-origin only** → Acceptable for v0.1 local testing. Supabase adapter removes this limitation.
- **No persistence** → If facilitator closes tab, session is lost. Acceptable for v0.1.
- **No conflict resolution** → With BroadcastChannel, message ordering is guaranteed within a single browser. Will need to address for Supabase in v1.
