## MODIFIED Requirements

### Requirement: Role-based view after session starts
WHEN the facilitator clicks "Start session" and the session status transitions from "lobby" to "active", the system SHALL render the host view for the facilitator and the play view for participants at `/session/:code`. The view rendered SHALL be determined by the participant's role (checked via facilitatorId in sessionStorage), not by separate URLs.

#### Scenario: Facilitator sees host view after start
- **WHEN** the facilitator clicks "Start session"
- **THEN** the facilitator sees the host view with the first topic and round controls

#### Scenario: Participant sees play view after start
- **WHEN** the session transitions to "active"
- **THEN** participants see the play view with the card hand for the first topic

#### Scenario: Late joiner sees play view
- **WHEN** a participant joins a session that is already in "active" status
- **THEN** they see the play view for the current round and can vote immediately

## ADDED Requirements

### Requirement: Session ended status
WHEN the facilitator triggers "End session", the session status SHALL transition from "active" to "ended". The system SHALL move the current round (if any) to `completedRounds`. All participants SHALL see a session-ended state.

#### Scenario: Session ends
- **WHEN** the facilitator clicks "End session"
- **THEN** session status becomes "ended"
- **AND** `currentRound` is moved to `completedRounds` and set to null
- **AND** all connected clients see the ended state within 2 seconds
