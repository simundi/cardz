## Why

The app can create sessions, manage topics, and handle participants joining — but it can't actually play Delegation Poker. The core game mechanic (voting with delegation level cards, facilitator-controlled rounds, and simultaneous reveal) is the entire reason the app exists. Phase 1 is complete; voting is the natural next step.

## What Changes

- Add a card hand UI showing 7 delegation level cards (Tell → Delegate) for participants
- Participants select a card to cast their vote, then confirm — vote is locked until reveal
- Facilitator controls the round lifecycle: current topic display, trigger reveal, advance to next topic
- Simultaneous card reveal — all votes shown at once when facilitator triggers reveal
- Round results view with vote distribution summary and discussion prompt
- Multi-round flow — facilitator advances through topics, each getting its own voting round
- Session end — facilitator ends session after all topics (or manually), transitioning to a summary state
- Role-based routing after session starts: facilitator sees HostView, participants see PlayView

## Capabilities

### New Capabilities
- `voting`: Card selection, vote submission, delegation levels 1-7, vote locking, simultaneous reveal
- `facilitation-flow`: Facilitator round controls, topic progression, reveal trigger, session end, round transitions

### Modified Capabilities
- `session-management`: After "Start session", routing must split by role (facilitator → HostView, participant → PlayView). The session status flow needs `ended` state when facilitator ends the session.

## Impact

- **Types**: New actions: `submit-vote`, `reveal-round`, `next-round`, `end-session`
- **Reducer**: New handlers for all voting actions, round state transitions
- **Pages**: `HostView.tsx` and `PlayView.tsx` — currently stubs, become full implementations
- **Components**: New card hand component, vote result display, round status indicators
- **Routing**: `/session/:code` must route based on session status and participant role (lobby vs active)
- **Store**: No new hooks needed — `useSession()` already exposes all session state including `currentRound` and `completedRounds`
