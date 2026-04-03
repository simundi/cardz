## Context

The app has a working session lifecycle up to the lobby: create session, join, manage topics, start session. The `start-session` action transitions status to `active` and creates a `currentRound` with the first scenario. However, HostView and PlayView are empty stubs, and no voting actions exist in the reducer. The type system already defines `Vote`, `Round`, `RoundStatus`, and `DelegationLevel` — ready to be used.

Current session status flow: `lobby → active → ended → finished`
Current round status flow: `voting → revealed`

## Goals / Non-Goals

**Goals:**
- Participants can select and submit a delegation level card (1-7)
- Facilitator controls round lifecycle: see who voted, trigger reveal, advance to next topic
- All votes revealed simultaneously when facilitator triggers reveal
- Round results show vote distribution
- Multi-round flow through all topics
- Session ends after last topic (or manually by facilitator)
- All actions sync in real time via existing SyncAdapter

**Non-Goals:**
- Changing vote after submission (icebox item)
- Timer per round (icebox item)
- Spectator mode (icebox item)
- Session summary/export screen (Phase 3)
- Animations on card flip (Phase 5)

## Decisions

### 1. Round state machine: voting → revealed

**Decision**: Keep the existing `RoundStatus` type (`voting` | `revealed`). During `voting`, participants submit cards. The facilitator triggers `reveal-round` to transition to `revealed`. From `revealed`, the facilitator can advance to the next topic (`next-round`) or end the session (`end-session`).

**Rationale**: Simple two-state model matches the game rules. No need for intermediate states like "waiting" — the facilitator controls pacing.

**Alternative considered**: Adding a "pending" state before voting starts — rejected because the round is created in `voting` state when the facilitator starts or advances.

### 2. Single route with role-based rendering

**Decision**: Keep `/session/:code` as the single route. Render Lobby, HostView, or PlayView based on session status and participant role, rather than navigating to separate `/host` and `/play` routes.

**Rationale**: Avoids URL-based role detection (insecure), keeps the URL shareable, and state-driven rendering is simpler than route-based. The existing route structure already has `/session/:code`.

**Alternative considered**: Separate `/session/:code/host` and `/session/:code/play` routes — rejected because it requires role verification per route and complicates the back button / refresh behavior.

### 3. Vote stored per round, one vote per participant

**Decision**: Votes are stored in `currentRound.votes[]`. A participant can only have one vote per round. Submitting again replaces the previous vote (during `voting` status only).

**Rationale**: Allows participants to change their mind before reveal without adding a separate "change vote" action. Once revealed, votes are locked (reducer ignores `submit-vote` when round status is `revealed`).

**Alternative considered**: Lock vote on first submission — rejected because it's frustrating if you misclick, and the spec says "select card → confirm" which implies a deliberate action.

### 4. Facilitator identity via sessionStorage

**Decision**: Reuse the existing `facilitatorId` in sessionStorage (set during session creation) to determine if the current user is the facilitator. Components check `sessionStorage.getItem('facilitatorId')` against `state.participants`.

**Rationale**: Already established in the join-session flow. No new mechanism needed.

### 5. New actions added to SessionAction union

**Decision**: Add four new actions:
- `submit-vote`: `{ participantId, level }` — adds/replaces vote in current round
- `reveal-round`: no payload — transitions round status to `revealed`
- `next-round`: no payload — moves current round to `completedRounds`, creates new round for next scenario
- `end-session`: no payload — transitions session status to `ended`

All actions broadcast via SyncAdapter (existing dispatch wrapper handles this).

**Rationale**: Minimal action set that covers the full round lifecycle. Each action maps to exactly one state transition.

### 6. Card hand as a reusable component

**Decision**: Create a `CardHand` component that renders 7 delegation level cards. It receives `onSelect` callback and `selectedLevel` prop. The PlayView manages vote state and dispatch.

**Rationale**: Separates presentation (cards) from behavior (voting logic). The component can be reused in results view or future features.

## Risks / Trade-offs

- **[Late joiner misses round context]** → When a participant joins mid-voting, they receive full state via `sync-state` including `currentRound`. They can vote immediately. Votes already cast are visible only after reveal. Acceptable.
- **[Facilitator refresh loses role]** → `facilitatorId` is in sessionStorage, which persists within the tab. A refresh preserves it. Opening a new tab loses it. Acceptable for Phase 1.
- **[Race on simultaneous vote + reveal]** → If a participant submits a vote at the exact moment the facilitator reveals, the vote may or may not be included depending on action ordering. Acceptable — BroadcastChannel delivers in order per sender.
- **[No "all voted" indicator]** → The facilitator can see who voted (count) but there's no auto-reveal. This is intentional — the facilitator decides when to reveal, even if not everyone has voted.
