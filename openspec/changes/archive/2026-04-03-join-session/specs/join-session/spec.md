## ADDED Requirements

### Requirement: Join page displays session info and name input
WHEN a participant opens `/join/:code`, the system SHALL display the session title and a name input field with a "Join session" button. The page SHALL be fully usable on screens >= 320px wide.

#### Scenario: Participant sees join screen
- **WHEN** a participant opens `/join/DELTA7` and session DELTA7 exists with title "Q3 Planning"
- **THEN** the page displays "Q3 Planning" as the heading, a prompt to enter their name, a name input field, and a "Join session" button

#### Scenario: Join page is responsive
- **WHEN** the join page is viewed on a 320px-wide screen
- **THEN** all elements are visible without horizontal scrolling

### Requirement: Participant submits name to join session
WHEN a participant enters a name (1-40 characters) and submits, the system SHALL add them to the session as a participant and redirect them to `/session/:code`.

#### Scenario: Successful join
- **WHEN** a participant enters "Maria" and clicks "Join session" on session DELTA7
- **THEN** a `join` action is dispatched with a new participant (unique ID, name "Maria", role "participant")
- **AND** the participant is redirected to `/session/DELTA7`

#### Scenario: Empty name rejected
- **WHEN** a participant submits with an empty or whitespace-only name
- **THEN** the system SHALL display a validation error "Please enter your name" and SHALL NOT dispatch a join action

### Requirement: Duplicate names auto-suffixed
WHEN a participant submits a name that already exists in the session, the system SHALL automatically append a numeric suffix (e.g., "Maria 2", "Maria 3") to make the name unique.

#### Scenario: Duplicate name handling
- **WHEN** session DELTA7 already has a participant named "Maria"
- **AND** a new participant enters "Maria" and submits
- **THEN** the new participant is added with name "Maria 2"

#### Scenario: Multiple duplicates
- **WHEN** session DELTA7 has participants "Maria" and "Maria 2"
- **AND** a new participant enters "Maria" and submits
- **THEN** the new participant is added with name "Maria 3"

### Requirement: Only joinable sessions accept participants
The system SHALL only allow joining sessions with status `lobby`, `voting`, or `revealed`. Sessions with status `finished`, `ended`, or that do not exist SHALL display an error screen.

#### Scenario: Finished session shows error
- **WHEN** a participant opens `/join/DELTA7` and session DELTA7 has status "finished"
- **THEN** the page displays "This session is no longer available." with a link back to the home page

#### Scenario: Non-existent session shows error
- **WHEN** a participant opens `/join/XXXXXX` and no session with code XXXXXX exists
- **THEN** the page displays "This session is no longer available." with a link back to the home page

#### Scenario: Lobby session is joinable
- **WHEN** a participant opens `/join/DELTA7` and session DELTA7 has status "lobby"
- **THEN** the join screen is displayed normally

#### Scenario: Voting session is joinable
- **WHEN** a participant opens `/join/DELTA7` and session DELTA7 has status "active" (voting in progress)
- **THEN** the join screen is displayed normally

### Requirement: Room code normalization
The system SHALL normalize room codes to uppercase before lookup. A participant visiting `/join/delta7` SHALL be treated the same as `/join/DELTA7`.

#### Scenario: Lowercase code normalized
- **WHEN** a participant opens `/join/delta7`
- **THEN** the system normalizes the code to "DELTA7" and looks up the session

### Requirement: Facilitator redirect on own join link
WHEN a facilitator opens the join link for their own session, the system SHALL detect their facilitator identity (via sessionStorage) and redirect them directly to `/session/:code` without showing the join form.

#### Scenario: Facilitator opens own join link
- **WHEN** the facilitator of session DELTA7 opens `/join/DELTA7`
- **AND** their facilitator ID matches a participant with role "facilitator" in the session
- **THEN** they are redirected to `/session/DELTA7` without seeing the join form

### Requirement: Join action synced to all connected clients
WHEN a participant joins, the `join` action SHALL be broadcast via the SyncAdapter to all other clients connected to the same session. All clients SHALL update their participant list by applying the action to their local reducer.

#### Scenario: Real-time join visibility
- **WHEN** participant "Maria" joins session DELTA7
- **THEN** all other clients connected to DELTA7 receive the `join` action
- **AND** "Maria" appears in their participant list within 2 seconds
