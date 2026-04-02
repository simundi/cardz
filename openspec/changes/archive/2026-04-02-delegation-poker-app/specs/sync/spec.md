## ADDED Requirements

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
