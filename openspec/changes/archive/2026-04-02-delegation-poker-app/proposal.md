## Why

There is no app yet. We need the foundational scaffold — project setup, routing, state management, and sync adapter interface — before we can build any features. This change establishes the skeleton that all future feature changes will build on.

## What Changes

- New React + Vite + TypeScript application scaffold with strict TS config
- Directory structure: `src/adapters/`, `src/store/`, `src/pages/`, `src/components/`
- React Router v6 with route stubs for `/`, `/session/:id/host`, `/session/:id/play`
- Session state types + reducer + Context provider (actions stubbed, not feature-complete)
- SyncAdapter interface + LocalAdapter (BroadcastChannel) implementation
- CSS design tokens and base styles (vanilla CSS, shadcn/ui conventions)

## Capabilities

### New Capabilities
- `sync`: SyncAdapter interface definition and BroadcastChannel-based LocalAdapter implementation

### Modified Capabilities
_None — greenfield project._

## Impact

- New project scaffold: Vite, React 18, TypeScript (strict), React Router v6
- New directories: `src/adapters/`, `src/store/`, `src/pages/`, `src/components/`
- No external dependencies beyond React ecosystem + Vite + shadcn/ui tooling
- No features yet — route pages are placeholder shells
