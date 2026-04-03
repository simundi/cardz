## Why

Players need a way to join an existing Delegation Poker session via a shared link. Without a join flow, only the facilitator can access the session — making the app unusable for its core multiplayer purpose. This is the final piece of the Phase 1 foundation before moving to the voting flow.

## What Changes

- Add a join page at `/join/:code` where participants enter their name and join the session
- Real-time participant list updates so all connected users (facilitator and participants) see new joiners immediately
- Validate session existence and status before allowing joins
- Handle edge cases: duplicate names, invalid/finished sessions, direct URL access

## Capabilities

### New Capabilities
- `join-session`: Covers the participant join flow — link handling, name input, session validation, joining logic, and redirect to session lobby

### Modified Capabilities
- `session-management`: The lobby participant list must update in real time as new participants join (REQ-16 already specifies a 2-second update window)

## Impact

- **Pages**: New `JoinPage` component at `/join/:code`
- **Components**: Join form component, potentially shared participant list component
- **Store**: New actions for participant joining, reducer handling for adding participants
- **Adapters**: SyncAdapter broadcasts `participant-joined` actions across tabs
- **Router**: New route `/join/:code`
