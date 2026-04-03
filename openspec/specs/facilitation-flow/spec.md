# spec: facilitation-flow
STATUS: Draft · CHANGE: voting-flow

## 1. Host view

### Requirements

REQ-42: The facilitator's host view SHALL display the current topic being voted on, the round number, the total number of topics, and a real-time count of votes submitted (without revealing values).

REQ-43: The host view SHALL provide a "Reveal votes" button during the voting phase. WHEN clicked, the system SHALL dispatch a `reveal-round` action that transitions the current round status from "voting" to "revealed". The button SHALL NOT be displayed when the round status is "revealed".

REQ-44: After reveal, the host view SHALL provide a "Next topic" button. WHEN clicked, the system SHALL dispatch a `next-round` action that moves the current round to `completedRounds` and creates a new round for the next scenario. The button SHALL NOT be displayed during "voting" status.

REQ-45: The host view SHALL provide an "End session" button. WHEN clicked, the system SHALL dispatch an `end-session` action that transitions the session status from "active" to "ended". On the last topic after reveal, the button text SHALL be "End session" instead of "Next topic".

### Scenarios

SCENARIO U — Facilitator controls round
GIVEN the facilitator is on the host view during round 2 of 5 topics
THEN they see the current topic description, "Round 2 of 5", and a vote count indicator
WHEN they click "Reveal votes"
THEN `currentRound.status` transitions to "revealed" and all clients display results
WHEN they click "Next topic"
THEN the current round moves to `completedRounds` and a new round is created for scenario 3

SCENARIO V — End session on last topic
GIVEN the facilitator is on the last topic (round 5 of 5) after reveal
THEN the "Next topic" button is replaced by "End session"
WHEN the facilitator clicks "End session"
THEN session status transitions to "ended"

SCENARIO W — End session early
GIVEN the facilitator clicks "End session" before completing all topics
THEN session status transitions to "ended"
AND the current round (if in progress) is moved to `completedRounds`

## 2. Participant view

### Requirements

REQ-46: The participant's play view SHALL display the current topic being voted on, the round number, and the card hand for voting. After submitting a vote, the view SHALL show a waiting state with "Waiting for reveal…".

REQ-47: WHEN the session status transitions to "ended", all participants SHALL see a summary state indicating the session has ended with the count of completed rounds.

### Scenarios

SCENARIO X — Participant voting and waiting
GIVEN a participant has submitted their vote
THEN they see "Waiting for reveal…" and the current topic
AND the card hand is no longer interactive
WHEN the facilitator reveals votes
THEN the participant sees the vote results (names + levels) and distribution summary

SCENARIO Y — Session ended view
GIVEN session status is "ended"
THEN all participants see "Session ended" with a summary of completed rounds

## 3. Real-time sync

### Requirements

REQ-48: All facilitator actions (`reveal-round`, `next-round`, `end-session`) SHALL be broadcast via the SyncAdapter. All connected clients SHALL update their view within 2 seconds.

### Scenarios

SCENARIO Z — Facilitator actions sync
GIVEN the facilitator clicks "Reveal votes"
THEN all participant views transition from voting/waiting to the results view within 2 seconds
GIVEN the facilitator clicks "Next topic"
THEN all participant views reset to a fresh card hand for the new topic within 2 seconds
