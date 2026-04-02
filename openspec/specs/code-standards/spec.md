# Code Standards

## Purpose
TypeScript and React coding conventions that ensure consistency, type safety, and maintainability across the codebase.

## Requirements

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
