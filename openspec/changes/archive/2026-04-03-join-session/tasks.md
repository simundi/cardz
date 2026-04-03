## 1. Join Page Core

- [x] 1.1 Verify JoinSession page displays session title and name input when session exists and is joinable
- [x] 1.2 Verify name submission dispatches `join` action with unique ID, entered name, and role "participant"
- [x] 1.3 Verify redirect to `/session/:code` after successful join
- [x] 1.4 Verify empty/whitespace name shows validation error and blocks submission

## 2. Session Validation

- [x] 2.1 Verify error screen shown for non-existent sessions with link back to home
- [x] 2.2 Verify error screen shown for finished/ended sessions
- [x] 2.3 Verify sessions in lobby, active (voting), and revealed status are joinable
- [x] 2.4 Verify room code normalization — lowercase codes treated as uppercase

## 3. Edge Cases

- [x] 3.1 Verify duplicate name auto-suffixing (e.g., "Maria" → "Maria 2" → "Maria 3")
- [x] 3.2 Verify facilitator opening own join link redirects to `/session/:code` without join form

## 4. Real-Time Sync

- [x] 4.1 Verify `join` action is broadcast via SyncAdapter to all connected clients
- [x] 4.2 Verify participant list on lobby/session page updates when a new participant joins (within 2 seconds)
- [x] 4.3 Verify both facilitator and existing participants see new joiners in real time

## 5. Participant List on Session Page

- [x] 5.1 Verify participant list displays all current participants by name
- [x] 5.2 Verify empty state shows "Waiting for participants to join…" when no participants have joined
