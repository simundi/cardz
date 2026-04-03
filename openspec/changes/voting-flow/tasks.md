## 1. Types & Reducer

- [x] 1.1 Add `submit-vote`, `reveal-round`, `next-round`, `end-session` to SessionAction union type
- [x] 1.2 Implement `handleSubmitVote` — add/replace vote in currentRound.votes (ignore if round status is "revealed")
- [x] 1.3 Implement `handleRevealRound` — transition currentRound.status from "voting" to "revealed"
- [x] 1.4 Implement `handleNextRound` — move currentRound to completedRounds, create new round for next scenario
- [x] 1.5 Implement `handleEndSession` — move currentRound to completedRounds (if any), set session status to "ended"

## 2. Routing

- [x] 2.1 Update `/session/:code` route to render Lobby, HostView, or PlayView based on session status and participant role
- [x] 2.2 Detect facilitator role via sessionStorage facilitatorId matching state.participants

## 3. Card Hand Component

- [x] 3.1 Create CardHand component — renders 7 delegation level cards (number + label), accepts onSelect and selectedLevel props
- [x] 3.2 Visually highlight selected card, de-highlight others on selection change
- [x] 3.3 Ensure card hand is responsive and usable at 320px viewport width

## 4. PlayView (Participant)

- [x] 4.1 Display current topic description and round number (e.g., "Round 2 of 5")
- [x] 4.2 Render CardHand, wire selection state and "Submit vote" button (disabled until card selected)
- [x] 4.3 On submit, dispatch `submit-vote` action and show "Waiting for reveal…" state
- [x] 4.4 After reveal, show all votes (participant name + delegation level) and vote distribution summary
- [x] 4.5 Reset card hand and voting state when a new round starts (next-round action received)
- [x] 4.6 Show "Session ended" state when session status transitions to "ended"

## 5. HostView (Facilitator)

- [x] 5.1 Display current topic description, round number ("Round X of Y"), and vote count ("N / M votes submitted")
- [x] 5.2 Add "Reveal votes" button — dispatches `reveal-round`, shown only during voting phase
- [x] 5.3 After reveal, show all votes and distribution summary (same as participant view)
- [x] 5.4 Add "Next topic" button after reveal — dispatches `next-round` (hidden on last topic)
- [x] 5.5 Show "End session" button — replaces "Next topic" on last topic, also available as secondary action on other topics
- [x] 5.6 Wire facilitator's own voting: facilitator can also vote using the card hand before revealing

## 6. Real-Time Sync

- [x] 6.1 Verify all new actions (submit-vote, reveal-round, next-round, end-session) broadcast via SyncAdapter
- [x] 6.2 Verify participant views update within 2 seconds of facilitator actions
- [x] 6.3 Verify vote count updates in real time on host view as participants submit
