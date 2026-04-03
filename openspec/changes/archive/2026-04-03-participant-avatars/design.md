## Context

The session UI currently shows participants as a plain `<li>` text list in the Lobby and a numeric counter ("3/5 votes submitted") in HostView. Participants in PlayView have zero visibility into other participants' status. There's no visual identity for members — no avatars, no initials, no role indicators.

The store already tracks everything needed: `state.participants` (with `id`, `name`, `role`) and `currentRound.votes` (with `participantId` and `level`). No store or adapter changes are required — this is purely a component/UI change.

## Goals / Non-Goals

**Goals:**
- Create a reusable `ParticipantStrip` component that displays participant avatars with status
- Show voting status per participant (waiting/voted/revealed) in HostView and PlayView
- Replace the plain name list in Lobby with avatars
- Visually distinguish the facilitator
- Work on 320px+ screens

**Non-Goals:**
- Uploading profile pictures or custom avatars (initials-only for now)
- Changing any store types, reducer logic, or adapter behavior
- Adding participant presence/online indicators
- Changing the VoteResults component (it stays as the detailed breakdown after reveal)

## Decisions

### 1. Single `ParticipantStrip` component with mode prop

Create one component that handles all three contexts via a `mode` prop:

- `mode="lobby"` — shows avatars + names, "Joined" status, no voting info
- `mode="voting"` — shows avatars + names + "Voted" / "Waiting" status
- `mode="revealed"` — shows avatars + names + vote level number

**Rationale**: One component, consistent look everywhere. The mode determines what status info to derive and display. Avoids three separate components with duplicated avatar logic.

**Alternative considered**: Separate `LobbyParticipants`, `VotingParticipants` components — rejected because 80% of the rendering logic is shared.

### 2. shadcn Avatar with initial-based AvatarFallback

Use shadcn `Avatar` + `AvatarFallback` showing 2-letter initials (first letter of first name + first letter of last name, or first two letters if single name).

**Rationale**: shadcn Avatar is the standard component for this. No profile images exist, so AvatarFallback with initials is the right fit. Consistent with the design system.

### 3. Visual status indicators

| State | Avatar style | Badge | Text below |
|-------|-------------|-------|------------|
| Lobby | Default (muted bg) | None | Name only |
| Waiting | Muted/faded (`opacity-50`) | None | "Waiting" in muted text |
| Voted | Primary ring (`ring-2 ring-primary`) | Small check icon (absolute positioned) | "Voted" in primary text |
| Revealed | Primary ring | Level number badge (small circle) | Name + level label |

**Rationale**: Ring + opacity is a clear, accessible binary signal. The check badge reinforces the "done" state. During reveal, the level number replaces the check — users want to see at a glance who voted what.

### 4. Facilitator indicator

Show a small star icon or "Host" label beneath the facilitator's avatar. Use `text-muted-foreground` styling to keep it subtle.

**Rationale**: Participants need to know who the facilitator is. A subtle label is enough — no need for a different colored avatar.

### 5. Layout: horizontal flex-wrap

```
<div className="flex flex-wrap justify-center gap-4">
  {participants.map(p => <ParticipantAvatar ... />)}
</div>
```

Each avatar item is a vertical stack: avatar (with badge) → name → status text. Fixed width per item (~64-72px) so they wrap predictably on narrow screens.

**Rationale**: Flex-wrap handles any participant count gracefully. Centers naturally. On 320px screens, fits 4 avatars per row comfortably.

### 6. Placement in page layouts

- **Lobby**: Replaces the existing `<ul>` participant list in the "Participants" section
- **HostView**: Between the round header and the card hand / action buttons. Replaces the "X/Y votes submitted" text
- **PlayView**: Between the round header and the card hand / waiting state. New addition — no existing element to replace

### 7. Component file structure

```
src/components/ParticipantStrip.tsx  — main component
```

Single file. The component internally maps participants to individual avatar items. No need for a separate `ParticipantAvatar` sub-component file — keep it as an internal render function or inline mapping.

## Risks / Trade-offs

- **Many participants**: With 15+ participants, the strip could take significant vertical space. Mitigation: the flex-wrap layout handles this naturally, and delegation poker sessions rarely exceed 10-12 people.
- **Long names**: Names could overflow the fixed-width item. Mitigation: truncate with `truncate` class (ellipsis) at ~72px max width.
- **Facilitator in strip**: The facilitator appears in `state.participants` with `role: 'facilitator'`. The strip should show ALL participants including the facilitator, with the role indicator. This is already how the data is structured.
