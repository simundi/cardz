# System Architecture

## Purpose
Structural decisions, layer boundaries, state management patterns, and real-time synchronization architecture.

## Requirements

### Requirement: Layer order and separation
The codebase MUST follow a strict layer order: pages → components → store → adapters → types. No module SHALL import upward or skip layers. Pages consume components and store hooks. Components render UI. Store manages state and exposes hooks. Adapters handle external communication. Types are shared across all layers.

#### Scenario: No upward imports
- **WHEN** a file in `src/adapters/` is inspected
- **THEN** it SHALL NOT import from `src/store/`, `src/components/`, or `src/pages/` (except types)

#### Scenario: No layer skipping
- **WHEN** a file in `src/pages/` needs adapter functionality
- **THEN** it SHALL access it through the store layer (hooks), not by importing adapters directly

### Requirement: SyncAdapter layer separation
All real-time communication MUST go through the SyncAdapter interface defined in `src/adapters/`. No component, hook, store, or utility outside `src/adapters/` SHALL directly import or reference `BroadcastChannel`, WebSocket, or any transport-specific API.

#### Scenario: No direct BroadcastChannel usage outside adapters
- **WHEN** the codebase is searched for `BroadcastChannel` outside `src/adapters/`
- **THEN** zero matches are found

#### Scenario: Transport swap
- **WHEN** the sync transport is changed from BroadcastChannel to Supabase Realtime
- **THEN** only files within `src/adapters/` require modification

### Requirement: SyncAdapter interface
The system SHALL define a SyncAdapter interface that abstracts real-time communication. All sync operations MUST go through this interface to allow swapping transport implementations.

#### Scenario: Adapter contract
- **WHEN** a sync adapter is implemented
- **THEN** it SHALL provide methods: `join(sessionId, role)`, `send(action)`, `onReceive(callback)`, and `leave()`

### Requirement: BroadcastChannel local adapter
The system SHALL provide a LocalAdapter implementation of SyncAdapter that uses BroadcastChannel for same-origin, multi-tab communication. The channel name SHALL be the session code.

#### Scenario: Actions sync across tabs
- **WHEN** a user dispatches an action in one tab
- **THEN** the action is received and applied in all other tabs connected to the same session

#### Scenario: Join notification
- **WHEN** a participant joins via the local adapter
- **THEN** all other connected clients receive a participant-joined action

### Requirement: Actions are the sync unit
The system SHALL synchronize state by broadcasting reducer actions (not full state snapshots). Each client maintains its own state by applying received actions to its local reducer.

#### Scenario: State consistency
- **WHEN** two clients start from the same initial state and receive the same sequence of actions
- **THEN** both clients arrive at identical state

### Requirement: Adapter cleanup on disconnect
The system SHALL close the BroadcastChannel and notify other clients when a user leaves (navigates away or closes tab).

#### Scenario: Clean disconnect
- **WHEN** a user navigates away from the session
- **THEN** the adapter calls `leave()`, closing the channel and broadcasting a disconnect action

### Requirement: State management via useSession hook
Session data MUST be accessed exclusively through the `useSession()` hook. Components SHALL NOT use `useState` for session data. All session mutations go through `dispatch` from the hook.

#### Scenario: No local session state
- **WHEN** a component needs session data (participants, scenarios, status)
- **THEN** it SHALL use `useSession()`, never `useState` with duplicated session data
