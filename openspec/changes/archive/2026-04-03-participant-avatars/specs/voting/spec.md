## MODIFIED Requirements

### Requirement: Per-participant voting status visibility
All `submit-vote` actions SHALL be broadcast via the SyncAdapter to all connected clients. During the voting phase, ALL users (facilitator and participants) SHALL see per-participant voting status — indicating which participants have voted and which are still waiting. Individual vote values SHALL NOT be visible until reveal. The facilitator SHALL also see the total vote count.

#### Scenario: Facilitator sees per-participant voting status
- **WHEN** 3 out of 5 participants have submitted votes during the voting phase
- **THEN** the facilitator's host view shows each participant's avatar with "Voted" or "Waiting" status
- **AND** the facilitator does NOT see the individual vote values until reveal

#### Scenario: Participants see per-participant voting status
- **WHEN** 3 out of 5 participants have submitted votes during the voting phase
- **THEN** each participant's play view shows all participants' avatars with "Voted" or "Waiting" status
- **AND** no participant sees individual vote values until reveal
