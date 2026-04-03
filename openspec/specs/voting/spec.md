# spec: voting
STATUS: Draft · CHANGE: voting-flow

## 1. Card hand and selection

### Requirements

REQ-33: The system SHALL display a hand of 7 cards to each participant during the voting phase. Each card SHALL represent one delegation level (1: Tell, 2: Sell, 3: Consult, 4: Agree, 5: Advise, 6: Inquire, 7: Delegate). Cards SHALL display both the level number and the label.

REQ-34: The system SHALL allow a participant to select exactly one card from their hand. The selected card SHALL be visually highlighted. Selecting a different card SHALL replace the previous selection.

REQ-35: The system SHALL provide a "Submit vote" button that is enabled only when a card is selected. WHEN the participant clicks "Submit vote", the system SHALL dispatch a `submit-vote` action with the participant's ID and selected delegation level, and display a confirmation state.

### Scenarios

SCENARIO O — Participant sees and selects a card
GIVEN a participant is on the play view during a round with status "voting"
THEN they see 7 cards labeled 1 (Tell) through 7 (Delegate)
WHEN they tap card "4 (Agree)"
THEN card 4 is visually highlighted and no other card is highlighted
WHEN they tap card "6 (Inquire)"
THEN card 6 becomes highlighted and card 4 is de-highlighted

SCENARIO P — Submit vote
GIVEN a participant selects card 5 (Advise) and clicks "Submit vote"
THEN a `submit-vote` action is dispatched with `{ participantId, level: 5 }`
AND the participant sees a "Vote submitted" confirmation
AND the card hand is replaced by a waiting state

## 2. Vote lifecycle

### Requirements

REQ-36: WHEN a participant who has already voted submits a new vote while the round status is "voting", the system SHALL replace their previous vote with the new one in `currentRound.votes`.

REQ-37: The system SHALL NOT accept `submit-vote` actions when the current round status is "revealed". The reducer SHALL return the current state unchanged.

### Scenarios

SCENARIO Q — Re-vote during voting
GIVEN participant "Maria" has already voted level 3
WHEN Maria submits a new vote with level 5 while the round is still in "voting" status
THEN Maria's vote in `currentRound.votes` is updated to level 5

SCENARIO R — Vote rejected after reveal
GIVEN the round status is "revealed"
WHEN a `submit-vote` action is dispatched
THEN the state is unchanged and the vote is not recorded

## 3. Reveal and results

### Requirements

REQ-38: WHEN the facilitator triggers reveal, all submitted votes SHALL be displayed simultaneously to all participants. Each vote SHALL show the participant's name and their selected delegation level card.

REQ-39: After reveal, the system SHALL display a summary of the vote distribution: how many participants voted for each level, and the overall spread (min, max).

REQ-40: All `submit-vote` actions SHALL be broadcast via the SyncAdapter to all connected clients. During the voting phase, ALL users (facilitator and participants) SHALL see per-participant voting status — indicating which participants have voted and which are still waiting. Individual vote values SHALL NOT be visible until reveal. The facilitator SHALL also see the total vote count.

### Scenarios

SCENARIO S — Votes revealed and distribution shown
GIVEN the facilitator triggers "Reveal votes" for a round with 4 participants
AND votes are: level 2, level 4, level 4, level 6
THEN all participants see every submitted vote at the same time
AND each vote displays the voter's name and their delegation level card
AND the summary shows the distribution across levels (min: 2, max: 6)

SCENARIO T — Facilitator sees per-participant voting status
GIVEN 3 out of 5 participants have submitted votes during the voting phase
THEN the facilitator's host view shows each participant's avatar with "Voted" or "Waiting" status
AND the facilitator does NOT see the individual vote values until reveal

SCENARIO T2 — Participants see per-participant voting status
GIVEN 3 out of 5 participants have submitted votes during the voting phase
THEN each participant's play view shows all participants' avatars with "Voted" or "Waiting" status
AND no participant sees individual vote values until reveal

## 4. Responsiveness

REQ-41: The card hand SHALL be fully usable on screens >= 320px wide with no horizontal scrolling.
