## 1. Setup & Infrastructure

- [ ] 1.1 Install shadcn/ui components: button, input, card (npx shadcn@latest add)
- [ ] 1.2 Wrap `AppRoutes` with `SessionProvider` in `App.tsx`
- [ ] 1.3 Add new routes: `/create` → CreateSession, `/join/:code` → JoinSession, `/session/:code` → Lobby
- [ ] 1.4 Update store types: add `title` to Session, add `code` to Session, add `finished` to session status union, add new actions (add-topic, remove-topic, start-session)

## 2. Domain Logic

- [ ] 2.1 Create `generateRoomCode()` utility — 6-char uppercase alphanumeric using crypto.getRandomValues
- [ ] 2.2 Add `handleAddTopic`, `handleRemoveTopic`, `handleStartSession` handlers to `sessionReducer`
- [ ] 2.3 Update `create-session` action payload to include session title and topics array
- [ ] 2.4 Create `generateParticipantName()` utility to handle duplicate name suffixing (e.g. "Maria 2")

## 3. Home Page (REQ-01 → REQ-06)

- [ ] 3.1 Implement Home page layout: Delegation Poker explanation (max 3 sentences), "Create session" button, "Join with a code" button
- [ ] 3.2 Implement inline join-by-code: toggled input field with submit, room code normalization (uppercase), URL extraction from pasted links
- [ ] 3.3 Implement join-code validation error state: inline error message, input preservation on error
- [ ] 3.4 Ensure responsive layout works at 320px viewport width

## 4. Create Session Page (REQ-07 → REQ-13)

- [ ] 4.1 Create `CreateSession` page with form: facilitator name, session title, topics multi-entry field
- [ ] 4.2 Implement topics multi-entry: add topic input + button, removable topic chips/list items, 1–120 char per topic
- [ ] 4.3 Implement field-level validation: required fields, character limits (name 1–40, title 1–80)
- [ ] 4.4 Implement form submission: generate room code, generate facilitator participant ID, dispatch create-session, navigate to /session/:code

## 5. Lobby Screen (REQ-14 → REQ-21)

- [ ] 5.1 Create `Lobby` page layout: session title, room code display (large type), copy link button
- [ ] 5.2 Implement "Copy link" with clipboard API: copy join URL, "Link copied!" confirmation (2s timeout), fallback selectable text field
- [ ] 5.3 Implement participant list: real-time updates via sync adapter, empty state ("Waiting for participants to join…")
- [ ] 5.4 Implement inline topic management: add topic form, ordered topic list with remove buttons
- [ ] 5.5 Implement "Start session" button: disabled when no topics, transitions session status from lobby to voting on click

## 6. Join Flow (REQ-22 → REQ-24)

- [ ] 6.1 Create `JoinSession` page: welcome screen with session title display and name input
- [ ] 6.2 Implement join submission: add participant to session via sync, redirect to /session/:code
- [ ] 6.3 Implement error states: session not found / finished → "This session is no longer available." with home link
- [ ] 6.4 Handle edge cases: duplicate name suffixing, facilitator self-join redirect

## 7. Verification

- [ ] 7.1 Verify typecheck passes (`npm run typecheck`)
- [ ] 7.2 Verify lint passes (`npm run lint`)
- [ ] 7.3 Manual walkthrough: create session → copy link → join → start session flow
