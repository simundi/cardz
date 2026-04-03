## MODIFIED Requirements

### Requirement: Real-time participant list on lobby
The lobby screen SHALL display a real-time list of participants who have joined, updating within 2 seconds of each join event. Each participant entry SHALL display the participant's name. The list SHALL be visible to all connected clients — both the facilitator and any participants who have already joined.

#### Scenario: Participant appears in facilitator's lobby
- **WHEN** participant "Maria" joins session DELTA7
- **AND** the facilitator is on the lobby screen at `/session/DELTA7`
- **THEN** "Maria" appears in the participant list within 2 seconds

#### Scenario: Participant appears in other participants' view
- **WHEN** participant "Carlos" joins session DELTA7
- **AND** participant "Maria" is already in the session viewing `/session/DELTA7`
- **THEN** "Carlos" appears in Maria's participant list within 2 seconds

#### Scenario: Empty participant state
- **WHEN** no participants have joined yet
- **THEN** the lobby screen displays "Waiting for participants to join…"
