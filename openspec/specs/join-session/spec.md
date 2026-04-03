# spec: join-session
STATUS: Draft · CHANGE: join-session

## 1. Join page

### Requirements

REQ-25: WHEN a participant opens `/join/:code`, the system SHALL display the session title and a name input field with a "Join session" button. The page SHALL be fully usable on screens >= 320px wide.

REQ-26: WHEN a participant enters a name (1-40 characters) and submits, the system SHALL add them to the session as a participant and redirect them to `/session/:code`.

REQ-27: WHEN a participant submits with an empty or whitespace-only name, the system SHALL display a validation error "Please enter your name" and SHALL NOT dispatch a join action.

REQ-28: WHEN a participant submits a name that already exists in the session, the system SHALL automatically append a numeric suffix (e.g., "Maria 2", "Maria 3") to make the name unique.

REQ-29: The system SHALL only allow joining sessions with status `lobby`, `voting`, or `revealed`. Sessions with status `finished`, `ended`, or that do not exist SHALL display an error screen: "This session is no longer available." with a link back to the home page.

REQ-30: The system SHALL normalize room codes to uppercase before lookup. A participant visiting `/join/delta7` SHALL be treated the same as `/join/DELTA7`.

REQ-31: WHEN a facilitator opens the join link for their own session, the system SHALL detect their facilitator identity (via sessionStorage) and redirect them directly to `/session/:code` without showing the join form.

REQ-32: WHEN a participant joins, the `join` action SHALL be broadcast via the SyncAdapter to all other clients connected to the same session. All clients SHALL update their participant list by applying the action to their local reducer within 2 seconds.

### Scenarios

SCENARIO I — Participant joins via link
GIVEN session "DELTA7" is in "lobby" status with title "Q3 Planning"
WHEN a participant opens /join/DELTA7
THEN they see "Q3 Planning" as the heading, a name input, and a "Join session" button
WHEN they enter "Maria" and submit
THEN they are redirected to /session/DELTA7
AND "Maria" appears in all connected clients' participant lists within 2s

SCENARIO J — Empty name rejected
GIVEN a participant is on the join page for session "DELTA7"
WHEN they submit with an empty name
THEN "Please enter your name" is displayed
AND no join action is dispatched

SCENARIO K — Duplicate name auto-suffixed
GIVEN session "DELTA7" has participants "Maria" and "Maria 2"
WHEN a new participant enters "Maria" and submits
THEN they are added with name "Maria 3"

SCENARIO L — Non-existent or finished session
GIVEN session "DELTA7" has status "finished" OR does not exist
WHEN a participant opens /join/DELTA7
THEN they see "This session is no longer available." with a link to home

SCENARIO M — Lowercase code normalized
WHEN a participant opens /join/delta7
THEN the system normalizes to "DELTA7" and looks up the session

SCENARIO N — Facilitator opens own join link
GIVEN the facilitator of session "DELTA7" opens /join/DELTA7
AND their facilitatorId in sessionStorage matches
THEN they are redirected to /session/DELTA7 without seeing the join form
