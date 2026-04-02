## 1. Project Scaffold

- [x] 1.1 Initialize Vite + React 18 + TypeScript project with strict TS config
- [x] 1.2 Set up directory structure: `src/adapters/`, `src/store/`, `src/pages/`, `src/components/`
- [x] 1.3 Create CSS design tokens and base styles (vanilla CSS, shadcn/ui conventions with cn() utility)
- [x] 1.4 Set up React Router with route stubs: `/`, `/session/:id/host`, `/session/:id/play`

## 2. State Management Foundation

- [x] 2.1 Define TypeScript types for session state (Session, Participant, Scenario, Round, Vote, DelegationLevel)
- [x] 2.2 Implement session reducer with initial actions (create-session, join, participant-left)
- [x] 2.3 Create SessionContext provider with useReducer and expose dispatch + state

## 3. Sync Adapter

- [x] 3.1 Define SyncAdapter interface (join, send, onReceive, leave)
- [x] 3.2 Implement LocalAdapter using BroadcastChannel
- [x] 3.3 Integrate adapter with SessionContext — broadcast dispatched actions and apply received actions
