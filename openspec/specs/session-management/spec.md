# spec: home-and-create-session
STATUS: Draft · CHANGE: home-and-create-session · REFS: REQ-01 → REQ-24

## 1. Home page

### Requirements

REQ-01: The home page SHALL display a concise explanation of what Delegation Poker is (max 3 sentences) visible without scrolling on any viewport ≥ 320px wide.

REQ-02: The home page SHALL present exactly two primary actions: "Create session" and "Join with a code".

REQ-03: WHEN a user clicks "Join with a code", the home page SHALL reveal an inline input field for the short room code without navigating away.

REQ-04: WHEN a user submits a room code from the home page, the system SHALL redirect them to the join screen for that session (/join/:code).

REQ-05: WHEN a user submits a room code that does not match any active session, the home page SHALL display an inline error: "Session not found. Check the code and try again." The input SHALL NOT clear.

REQ-06: The home page SHALL be fully usable on screens ≥ 320px wide with no horizontal scroll.

### Scenarios

SCENARIO A — New user lands on home page
GIVEN a user visits "/" for the first time
THEN they see a brief explanation of Delegation Poker
AND a "Create session" button
AND a "Join with a code" button
AND no session-specific content is visible

SCENARIO B — User joins via code on home page
GIVEN a user clicks "Join with a code"
WHEN they type "DELTA7" and submit
AND session DELTA7 is active
THEN they are redirected to /join/DELTA7

SCENARIO C — User enters invalid code
GIVEN a user submits code "XXXXXX"
AND no session with that code exists
THEN an inline error appears below the input
AND the user remains on the home page
AND the code "XXXXXX" remains in the input field

## 2. Create session flow

### Requirements — form

REQ-07: WHEN a user clicks "Create session", the system SHALL navigate to a create session form at /create.

REQ-08: The create session form SHALL contain exactly three fields: Facilitator name (required), Session title (required), Topics (optional, multi-entry).

REQ-09: The Topics field SHALL allow the user to add multiple topics as individual entries. Each topic entry SHALL be removable before submission.

REQ-10: WHEN the user submits the form with Facilitator name or Session title empty, the system SHALL display a field-level validation error and SHALL NOT create the session.

REQ-11: Facilitator name SHALL accept 1–40 characters. Session title SHALL accept 1–80 characters. Each topic entry SHALL accept 1–120 characters.

REQ-12: WHEN the form is submitted with valid required fields, the system SHALL generate a unique 6-character uppercase alphanumeric room code and create the session in memory.

REQ-13: WHEN a session is created, the system SHALL immediately redirect the facilitator to the lobby screen at /session/:code with facilitator role assigned.

### Requirements — lobby screen

REQ-14: The lobby screen SHALL display the session title, the 6-character room code in large readable type, and a "Copy link" button.

REQ-15: WHEN the facilitator clicks "Copy link", the system SHALL copy the full join URL (https://[domain]/join/:code) to the clipboard and display a confirmation "Link copied!" for 2 seconds, then reset.

REQ-16: The lobby screen SHALL display a real-time list of participants who have joined, updating within 2 seconds of each join event. Each participant entry SHALL display the participant's name. The list SHALL be visible to all connected clients — both the facilitator and any participants who have already joined.

REQ-17: WHEN no participants have joined yet, the lobby screen SHALL display an empty state: "Waiting for participants to join…"

REQ-18: The lobby screen SHALL allow the facilitator to add topics via an inline form: a text input and "Add topic" button. Each added topic SHALL appear in an ordered list below.

REQ-19: Each topic in the lobby list SHALL have a remove button. WHEN a topic is removed, the system SHALL update the list immediately without confirmation.

REQ-20: The lobby screen SHALL display a "Start session" button. WHEN the facilitator clicks it, the system SHALL transition the session status from "lobby" to "voting" and navigate to the first topic.

REQ-21: The "Start session" button SHALL be disabled when the topics list is empty. WHEN at least one topic exists, the button SHALL become enabled.

### Scenarios

SCENARIO D — Facilitator creates session and shares link
GIVEN a facilitator fills in name "Ana" and title "Q3 Planning"
AND adds two topics
WHEN they submit the form
THEN a session is created with a 6-char room code
AND they are redirected to the lobby screen
AND the room code and a Copy link button are visible
AND the Start session button is disabled until topics exist

SCENARIO E — Facilitator copies link and shares it
GIVEN the facilitator is on the lobby screen
WHEN they click "Copy link"
THEN the full URL https://[domain]/join/:code is copied to clipboard
AND a "Link copied!" confirmation appears for 2 seconds then resets
AND if clipboard API is unavailable the URL appears in a selectable text field instead

SCENARIO F — Facilitator starts session
GIVEN the lobby has at least one topic
AND at least one participant has joined
WHEN the facilitator clicks "Start session"
THEN session status transitions from lobby to voting
AND all participants are navigated to the first topic

## 3. Join flow

### Requirements

REQ-22: WHEN a participant opens a join URL (/join/:code), the system SHALL display a welcome screen showing the session title and a name input field.

REQ-23: WHEN a participant submits their name, the system SHALL add them to the session as a participant and redirect them to /session/:code.

REQ-24: WHEN a participant opens a join URL (/join/:code), IF the session does not exist OR has status "finished", the system SHALL display an error screen: "This session is no longer available." with a link back to the home page. Sessions with status lobby, voting, or revealed SHALL be joinable.

### Scenarios

SCENARIO G — Participant joins via link
GIVEN session "DELTA7" is in "lobby" status
WHEN a participant opens /join/DELTA7
THEN they see the session title and a name input
WHEN they enter "Maria" and submit
THEN they are redirected to /session/DELTA7
AND "Maria" appears in the facilitator's participant list within 2s

SCENARIO H — Participant opens finished session link
GIVEN session "DELTA7" has status "finished"
WHEN a participant opens /join/DELTA7
THEN they see "This session is no longer available."
AND a link to return to the home page
AND sessions in lobby, voting, or revealed status are NOT affected

## 4. Edge cases

- Facilitator refreshes the lobby page: session state is preserved, they remain as facilitator
- Participant enters a name already taken: system appends a number suffix automatically (e.g. "Maria 2")
- Facilitator opens their own join link: system detects facilitator identity in sessionStorage and redirects to /session/:code directly
- Room code entered in lowercase: normalized to uppercase before lookup
- User pastes a full join URL into the code input on home page: system extracts the code from the URL and proceeds normally
- Participant joins while facilitator is adding a topic: both events reflected without conflict
- Session title contains special characters or emojis: stored and displayed as-is, no sanitization beyond length limit
- "Copy link" clicked on browser without clipboard API: fallback to selectable text field showing the URL

## 5. Out of scope

- Email or SMS delivery of the join link
- Password-protected sessions
- Persistent sessions beyond the browser tab lifecycle
- Editing session title or facilitator name after creation
- Reordering topics in the lobby
- Maximum participant limit enforcement
