## ADDED Requirements

### Requirement: Facilitator host view during voting
The facilitator's host view SHALL display the current topic being voted on, the round number, the total number of topics, and a real-time count of votes submitted (without revealing values).

#### Scenario: Host view during voting
- **WHEN** the facilitator is on the host view during round 2 of 5 topics
- **THEN** they see the current topic description, "Round 2 of 5", and a vote count indicator

### Requirement: Facilitator triggers reveal
The host view SHALL provide a "Reveal votes" button during the voting phase. WHEN clicked, the system SHALL dispatch a `reveal-round` action that transitions the current round status from "voting" to "revealed".

#### Scenario: Reveal votes
- **WHEN** the facilitator clicks "Reveal votes" during a voting round
- **THEN** a `reveal-round` action is dispatched
- **AND** `currentRound.status` transitions to "revealed"
- **AND** all connected clients display the vote results

#### Scenario: Reveal button only during voting
- **WHEN** the round status is "revealed"
- **THEN** the "Reveal votes" button is not displayed

### Requirement: Facilitator advances to next topic
After reveal, the host view SHALL provide a "Next topic" button. WHEN clicked, the system SHALL dispatch a `next-round` action that moves the current round to `completedRounds` and creates a new round for the next scenario in the list.

#### Scenario: Advance to next topic
- **WHEN** the facilitator clicks "Next topic" after revealing round 2 of 5
- **THEN** the current round is moved to `completedRounds`
- **AND** a new round is created for scenario 3 with status "voting"
- **AND** all participants' card hands are reset for the new round

#### Scenario: Next topic button only after reveal
- **WHEN** the round status is "voting"
- **THEN** the "Next topic" button is not displayed

### Requirement: Facilitator ends session
The host view SHALL provide an "End session" button. WHEN clicked, the system SHALL dispatch an `end-session` action that transitions the session status from "active" to "ended". On the last topic, after reveal, the button text SHALL be "End session" instead of "Next topic".

#### Scenario: End session on last topic
- **WHEN** the facilitator is on the last topic (round 5 of 5) after reveal
- **THEN** the "Next topic" button is replaced by "End session"
- **WHEN** the facilitator clicks "End session"
- **THEN** session status transitions to "ended"

#### Scenario: End session early
- **WHEN** the facilitator clicks "End session" before completing all topics
- **THEN** session status transitions to "ended"
- **AND** the current round (if in progress) is moved to `completedRounds`

### Requirement: Participant view during voting
The participant's play view SHALL display the current topic being voted on, the round number, and the card hand for voting. After submitting a vote, the view SHALL show a waiting state with "Waiting for reveal…".

#### Scenario: Participant waiting state
- **WHEN** a participant has submitted their vote
- **THEN** they see "Waiting for reveal…" and the current topic
- **AND** the card hand is no longer interactive

#### Scenario: Participant sees results after reveal
- **WHEN** the facilitator reveals votes
- **THEN** all participants see the vote results (names + levels) and distribution summary

### Requirement: Participant view after session ends
WHEN the session status transitions to "ended", all participants SHALL see a summary state indicating the session has ended.

#### Scenario: Session ended view
- **WHEN** session status is "ended"
- **THEN** all participants see "Session ended" with a summary of completed rounds

### Requirement: All facilitation actions synced in real time
All facilitator actions (`reveal-round`, `next-round`, `end-session`) SHALL be broadcast via the SyncAdapter. All connected clients SHALL update their view within 2 seconds.

#### Scenario: Reveal syncs to all clients
- **WHEN** the facilitator clicks "Reveal votes"
- **THEN** all participant views transition from voting/waiting to the results view within 2 seconds

#### Scenario: Next round syncs to all clients
- **WHEN** the facilitator clicks "Next topic"
- **THEN** all participant views reset to a fresh card hand for the new topic within 2 seconds
