## ADDED Requirements

### Requirement: Card hand displays 7 delegation levels
The system SHALL display a hand of 7 cards to each participant during the voting phase. Each card SHALL represent one delegation level (1: Tell, 2: Sell, 3: Consult, 4: Agree, 5: Advise, 6: Inquire, 7: Delegate). Cards SHALL display both the level number and the label.

#### Scenario: Participant sees card hand
- **WHEN** a participant is on the play view during a round with status "voting"
- **THEN** they see 7 cards labeled 1 (Tell) through 7 (Delegate)

#### Scenario: Cards are responsive
- **WHEN** the card hand is viewed on a 320px-wide screen
- **THEN** all 7 cards are visible and selectable without horizontal scrolling

### Requirement: Participant selects a card to vote
The system SHALL allow a participant to select exactly one card from their hand. The selected card SHALL be visually highlighted. Selecting a different card SHALL replace the previous selection.

#### Scenario: Card selection
- **WHEN** a participant taps card "4 (Agree)"
- **THEN** card 4 is visually highlighted as selected
- **AND** no other card is highlighted

#### Scenario: Change selection before submit
- **WHEN** a participant has card 4 selected and taps card 6
- **THEN** card 6 becomes highlighted and card 4 is de-highlighted

### Requirement: Participant confirms vote
The system SHALL provide a "Submit vote" button that is enabled only when a card is selected. WHEN the participant clicks "Submit vote", the system SHALL dispatch a `submit-vote` action with the participant's ID and selected delegation level, and display a confirmation state.

#### Scenario: Submit vote
- **WHEN** a participant selects card 5 (Advise) and clicks "Submit vote"
- **THEN** a `submit-vote` action is dispatched with `{ participantId, level: 5 }`
- **AND** the participant sees a "Vote submitted" confirmation
- **AND** the card hand is replaced by a waiting state

#### Scenario: Submit button disabled without selection
- **WHEN** no card is selected
- **THEN** the "Submit vote" button is disabled

### Requirement: Vote replaces previous vote during voting phase
WHEN a participant who has already voted submits a new vote while the round status is "voting", the system SHALL replace their previous vote with the new one in `currentRound.votes`.

#### Scenario: Re-vote during voting
- **WHEN** participant "Maria" has already voted level 3
- **AND** Maria submits a new vote with level 5 while the round is still in "voting" status
- **THEN** Maria's vote in `currentRound.votes` is updated to level 5

### Requirement: Votes ignored after reveal
The system SHALL NOT accept `submit-vote` actions when the current round status is "revealed". The reducer SHALL return the current state unchanged.

#### Scenario: Vote rejected after reveal
- **WHEN** the round status is "revealed"
- **AND** a `submit-vote` action is dispatched
- **THEN** the state is unchanged and the vote is not recorded

### Requirement: Simultaneous vote reveal
WHEN the facilitator triggers reveal, all submitted votes SHALL be displayed simultaneously to all participants. Each vote SHALL show the participant's name and their selected delegation level card.

#### Scenario: All votes revealed at once
- **WHEN** the facilitator triggers "Reveal votes"
- **THEN** all participants see every submitted vote at the same time
- **AND** each vote displays the voter's name and their delegation level card

### Requirement: Vote distribution summary
After reveal, the system SHALL display a summary of the vote distribution: how many participants voted for each level, and the overall spread (min, max).

#### Scenario: Distribution displayed after reveal
- **WHEN** votes are revealed for a round with 4 participants
- **AND** votes are: level 2, level 4, level 4, level 6
- **THEN** the summary shows the distribution across levels
- **AND** the spread is displayed (min: 2, max: 6)

### Requirement: Votes synced in real time
All `submit-vote` actions SHALL be broadcast via the SyncAdapter to all connected clients. The facilitator SHALL see a count of votes received (but not the values) during the voting phase.

#### Scenario: Facilitator sees vote count
- **WHEN** 3 out of 5 participants have submitted votes
- **THEN** the facilitator's host view shows "3 / 5 votes submitted"
- **AND** the facilitator does NOT see the individual vote values until reveal
