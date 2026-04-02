## Why

The app currently has a stub Home page with no interactivity. Users need a way to create a new delegation poker session and enter their name as facilitator, which is the entry point to the entire app flow.

## What Changes

- Implement the Home page with a "Create Session" form (facilitator name input + submit button)
- On submit, generate a session ID, dispatch `create-session` action, and navigate to `/session/:id/host`
- Add a hero/branding area to the Home page for visual identity
- Wire up the SessionProvider so session state is available after creation

## Capabilities

### New Capabilities
- `session-management`: Covers session creation flow, session ID generation, and the create-session user interaction on the Home page

### Modified Capabilities
_None — no existing spec requirements are changing._

## Impact

- **Pages**: `src/pages/Home.tsx` — replace stub with functional create-session form
- **Store**: Wire `SessionProvider` into the app tree if not already connected
- **Routes**: No route changes needed (routes already defined)
- **Components**: New form/UI components in `src/components/`
- **Dependencies**: No new dependencies — uses existing shadcn/ui + store layer
