## Context

The Delegation Poker app already has a partial join flow implementation: `JoinSession.tsx` exists at `/join/:code`, the reducer handles `join` actions, and the SyncAdapter broadcasts actions across tabs via BroadcastChannel. However, the current implementation has gaps around real-time participant visibility for all connected users and edge case handling.

The session-management spec (REQ-22 to REQ-24) defines the join requirements. The system-architecture spec mandates all sync goes through SyncAdapter and all session data through `useSession()`.

## Goals / Non-Goals

**Goals:**
- Participants joining via `/join/:code` see the session title and enter their name
- On join, participant is added to session state and synced to all connected clients in real time
- All participants (including facilitator) see new joiners appear in the participant list within 2 seconds
- Proper validation: session existence, session status, duplicate name handling
- Participants redirected to `/session/:code` see the current participant list

**Non-Goals:**
- Cross-device sync (Phase 4 — Supabase)
- Participant avatars or profile customization (Phase 5)
- Maximum participant limit enforcement
- Participant removal by facilitator
- Reconnection handling after tab close

## Decisions

### 1. Join action flows through existing SyncAdapter

**Decision**: The `join` action dispatched in JoinSession.tsx is already broadcast via BroadcastChannel through the SyncAdapter. No new sync mechanism needed.

**Rationale**: The architecture already supports this — `useSync` in the store listens for incoming actions and applies them to the local reducer. This gives us real-time updates across all tabs connected to the same session.

**Alternative considered**: Polling or separate participant-list endpoint — rejected because the action-based sync model is already in place and working for other actions.

### 2. Session lookup via shared state

**Decision**: The join page reads session data from the shared `useSession()` hook to determine if the session exists and is joinable. This relies on the joining client receiving the session state via BroadcastChannel when it connects.

**Rationale**: Consistent with the architecture spec's mandate that all session data goes through `useSession()`. The LocalAdapter's `join()` method connects to the BroadcastChannel, and the existing state sync mechanism shares the current session state.

**Alternative considered**: Storing session metadata separately (e.g., sessionStorage) — rejected because it breaks the single-source-of-truth principle.

### 3. Duplicate name handling via utility function

**Decision**: Use the existing `generateParticipantName()` utility to auto-suffix duplicate names (e.g., "Maria" → "Maria 2").

**Rationale**: Already implemented in `src/lib/generateParticipantName.ts` and used in JoinSession.tsx. Follows the spec's edge case requirement.

### 4. Participant list is a shared component on lobby/session page

**Decision**: The participant list on `/session/:code` (Lobby) renders from `state.participants` via `useSession()`. Since state updates propagate through the reducer, any `join` action automatically updates the list for all connected clients.

**Rationale**: No separate participant-tracking needed. The reducer's `handleJoin` appends to `state.participants`, and React re-renders the list.

## Risks / Trade-offs

- **[State not available on first load]** → If a participant opens `/join/:code` in a fresh tab before the facilitator's tab broadcasts state, the session may appear non-existent. Mitigation: The LocalAdapter should request current state on join, and the facilitator's client should respond with a state snapshot.
- **[Tab closed before sync]** → If a participant joins and immediately closes the tab, other clients may not receive the join action. Mitigation: Acceptable for Phase 1 (local-only); Phase 4 (Supabase) will add persistence.
- **[Race condition on duplicate names]** → Two participants joining simultaneously with the same name could both get the unsuffixed name. Mitigation: Unlikely in local-only mode; acceptable risk for now.
