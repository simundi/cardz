## Context

The app has a working store layer (`sessionReducer` with `create-session` action), a `SessionProvider` context, routing (`/` → Home, `/session/:id/host` → HostView), and sync adapters — but the Home page is a stub with no interactivity. The `SessionProvider` is not yet wired into the component tree. No shadcn/ui components have been installed yet.

## Goals / Non-Goals

**Goals:**
- Functional Home page where a facilitator can enter their name and create a session
- Session creation dispatches `create-session` action and navigates to the host view
- Clean, branded landing page using shadcn/ui primitives
- `SessionProvider` wrapping the app so state persists across navigation

**Non-Goals:**
- Join session flow (separate change)
- Session persistence / URL sharing
- Authentication or user accounts
- Real-time sync setup (already handled by `useSync` hook, not triggered here)

## Decisions

### 1. Wrap SessionProvider at App level
The `SessionProvider` wraps all routes inside `BrowserRouter` so that session state survives navigation from Home → HostView. This is the simplest approach and matches the existing architecture.

**Alternative considered**: Provider per-route — rejected because session state must persist across page transitions.

### 2. Session ID generation with crypto.randomUUID()
Use the browser's built-in `crypto.randomUUID()` for session IDs. It's available in all modern browsers, requires no dependencies, and produces proper UUIDs.

**Alternative considered**: nanoid — rejected to avoid adding a dependency for a single use case.

### 3. Install shadcn/ui Button and Input components
Install only `button` and `input` from shadcn/ui via `npx shadcn@latest add`. These are the minimum needed for the create-session form.

**Alternative considered**: Hand-roll form components — rejected because shadcn/ui is the chosen design system and provides accessible, styled primitives.

### 4. Form uses controlled input + onSubmit
A simple controlled input for facilitator name with form `onSubmit`. Validation is minimal: name must be non-empty (trimmed). No need for a form library — this is a single field.

### 5. Generate participant ID with crypto.randomUUID()
The facilitator's `Participant.id` is also generated with `crypto.randomUUID()` at form submission time, alongside the session ID.

## Risks / Trade-offs

- **[No session recovery]** → If the user refreshes, session state is lost. Accepted — persistence is a future concern.
- **[No input sanitization beyond trim]** → Name is used only in local state, not sent to a server. XSS risk is minimal in React's escaped rendering.
