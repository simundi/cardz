# Delegation Poker — Roadmap

## Status legend
- ✅ done
- 🔵 in progress
- 🟡 planned
- 💭 icebox (not yet scoped)

---

## Phase 1 — Foundation & Session Flow ✅
> Specs: session-management, system-architecture, code-standards, ui-ux

- ✅ Project scaffold (Vite + React 18 + TS strict + Tailwind + shadcn/ui)
- ✅ Architecture layers (pages → components → store → adapters → types)
- ✅ State management (useReducer + Context + useSession hook)
- ✅ SyncAdapter abstraction + LocalAdapter (BroadcastChannel)
- ✅ Home page (create / join entry points)
- ✅ Create session flow (facilitator name, title, topics)
- ✅ Lobby (room code, copy link, participant list, topic management)
- ✅ Join session flow (name input, validation, duplicate handling)

---

## Phase 2 — Voting Flow 🟡 ← you are here
> Specs needed: voting, facilitation-flow

- 🟡 Write voting spec (card selection, round lifecycle, delegation levels 1-7)
- 🟡 Write facilitation-flow spec (facilitator controls, round transitions)
- 🟡 Card hand UI (7 delegation level cards for participants)
- 🟡 Vote submission (select card → confirm → wait for reveal)
- 🟡 Facilitator round controls (start round, pick topic, trigger reveal)
- 🟡 Card reveal (all votes shown simultaneously)
- 🟡 Round results view (vote distribution, discussion prompt)
- 🟡 Multi-round flow (next topic → new round → repeat)

---

## Phase 3 — Session Wrap-up 🟡
> Spec needed: session-summary

- 🟡 Session summary screen (all rounds, vote distributions per topic)
- 🟡 End session flow (facilitator ends → all participants see summary)
- 🟡 Export summary as CSV or image

---

## Phase 4 — Real-time Sync Upgrade 🟡
> Spec update: system-architecture (adapter swap)

- 🟡 Supabase adapter (replaces LocalAdapter for cross-device sync)
- 🟡 Reconnection handling (rejoin after disconnect, state recovery)
- 🟡 Session persistence (survive page refresh)

---

## Phase 5 — Polish & Delight 🟡

- 🟡 Card flip animation on reveal
- 🟡 Responsive tuning for voting screens
- 🟡 Participant avatars / colors
- 🟡 Sound or haptic on reveal
- 🟡 Loading states and skeleton screens

---

## Phase 6 — Testing 🟡

- 🟡 Unit tests for reducer and utilities
- 🟡 Component tests for key flows (create, join, vote)
- 🟡 Integration tests for sync across tabs

---

## Icebox 💭
> Ideas worth exploring later — no spec or timeline yet

- 💭 Edit topics mid-session (facilitator reorders/adds during voting)
- 💭 Change vote before reveal (participant second-guesses)
- 💭 Session history (view past sessions and results)
- 💭 Password-protected sessions
- 💭 Authentication / user accounts
- 💭 Timer per round (optional pressure mechanic)
- 💭 Spectator mode (observe without voting)
