## ADDED Requirements

### Requirement: Strict TypeScript
All source files MUST use TypeScript with `strict: true` compiler options. Code MUST NOT use `any`, `@ts-ignore`, or non-null assertions (`!`) unless accompanied by a justifying comment. All function parameters and return types MUST be explicitly annotated.

#### Scenario: No implicit any
- **WHEN** a source file is compiled
- **THEN** it SHALL produce zero TypeScript errors under `strict: true`

#### Scenario: Explicit annotations
- **WHEN** a function is defined
- **THEN** all parameters and the return type SHALL have explicit type annotations

### Requirement: Functional React components only
All React components MUST be written as functional components using arrow function syntax. Class components MUST NOT be used. Components MUST use hooks for state and side effects.

#### Scenario: Component definition
- **WHEN** a new React component is created
- **THEN** it SHALL be a named arrow function exported with explicit props type

#### Scenario: No class components
- **WHEN** the codebase is searched for `extends React.Component` or `extends Component`
- **THEN** zero matches are found

### Requirement: SyncAdapter layer separation
All real-time communication MUST go through the SyncAdapter interface defined in `src/adapters/`. No component, hook, store, or utility outside `src/adapters/` SHALL directly import or reference `BroadcastChannel`, WebSocket, or any transport-specific API.

#### Scenario: No direct BroadcastChannel usage outside adapters
- **WHEN** the codebase is searched for `BroadcastChannel` outside `src/adapters/`
- **THEN** zero matches are found

#### Scenario: Transport swap
- **WHEN** the sync transport is changed from BroadcastChannel to Supabase Realtime
- **THEN** only files within `src/adapters/` require modification

### Requirement: shadcn/ui conventions
UI components MUST follow shadcn/ui conventions: composable primitives, `cn()` utility for className merging, and variants via `class-variance-authority`. Components MUST accept a `className` prop for consumer-side overrides.

#### Scenario: Component className merging
- **WHEN** a UI component receives a `className` prop
- **THEN** it SHALL merge it with internal classes using the `cn()` utility

#### Scenario: Component composability
- **WHEN** a UI component is built
- **THEN** it SHALL expose composable sub-components rather than monolithic prop-driven APIs where applicable

### Requirement: Clean functions with single responsibility
Every function MUST have a single responsibility. Functions MUST NOT exceed 20 lines of logic (excluding type definitions, blank lines, and closing braces). Function names MUST clearly describe their purpose using verb-noun convention (e.g., `createSession`, `handleVoteSubmit`).

#### Scenario: Function length
- **WHEN** a function body exceeds 20 lines of logic
- **THEN** it SHALL be decomposed into smaller named functions

#### Scenario: Function naming
- **WHEN** a function is defined
- **THEN** its name SHALL use verb-noun convention that describes what it does without reading the body

### Requirement: No business logic in components
React components MUST NOT contain business logic directly. Business logic MUST be extracted into custom hooks, utility functions, or the reducer. Components are responsible only for rendering and delegating events.

#### Scenario: Logic extraction
- **WHEN** a component needs to perform data transformation, validation, or state computation
- **THEN** that logic SHALL live in a custom hook or utility function, not inline in the component body
