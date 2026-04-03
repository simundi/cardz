## Why

The current session UI shows participants as a plain text list in the Lobby and only a vote count ("3/5 votes submitted") during active rounds. There's no visual identity for participants and no per-person voting status visibility. This makes it hard to see at a glance who's joined, who's voted, and who's still thinking — reducing engagement and situational awareness for both facilitators and participants.

## What Changes

- Add a **participant avatar strip** component using shadcn Avatar with initial-based fallbacks
- Display the strip in **Lobby**, **HostView**, and **PlayView** — consistent across all session views
- Show per-participant **voting status** during active rounds:
  - `Waiting` — muted avatar, no badge
  - `Voted` — primary-colored ring + check badge (vote value hidden until reveal)
  - `Revealed` — vote level number displayed as badge on avatar
- Visually distinguish the **facilitator** from participants (subtle indicator)
- Replace the plain name list in Lobby with avatar grid
- Replace the "X/Y votes submitted" counter in HostView with the avatar strip (count is now implicit)
- Horizontal wrapping layout, fully responsive on 320px+ screens

## Capabilities

### New Capabilities
- `participant-avatars`: Avatar-based participant display component with name, initials, role indicator, and voting status

### Modified Capabilities
- `ui-ux`: Add participant avatar strip to the design system components and layout patterns
- `voting`: Add per-participant voting status visibility requirements (all users see who voted/waiting)

## Impact

- **Pages**: `Lobby.tsx`, `HostView.tsx`, `PlayView.tsx` — integrate avatar strip component
- **Components**: New `ParticipantStrip` component (or similar), uses shadcn `Avatar`
- **Dependencies**: Need to install shadcn `Avatar` component (`npx shadcn@latest add avatar`)
- **Store**: No changes — voting status already derivable from `currentRound.votes` + `participants`
- **Adapters**: No changes
