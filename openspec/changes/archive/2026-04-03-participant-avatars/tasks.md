## 1. Setup

- [x] 1.1 Install shadcn Avatar component (`npx shadcn@latest add avatar`)
- [x] 1.2 Create utility function `getInitials(name: string): string` that extracts 2-letter uppercase initials from a participant name

## 2. ParticipantStrip Component

- [x] 2.1 Create `src/components/ParticipantStrip.tsx` with props: `participants`, `currentRound`, `mode` (`lobby` | `voting` | `revealed`)
- [x] 2.2 Implement avatar rendering with shadcn Avatar + AvatarFallback showing initials
- [x] 2.3 Implement lobby mode — avatars + names, no status indicators
- [x] 2.4 Implement voting mode — derive voted/waiting status from `currentRound.votes`, show primary ring + check badge for voted, muted opacity for waiting
- [x] 2.5 Implement revealed mode — show vote level number as badge on avatar
- [x] 2.6 Add facilitator "Host" label for participants with `role: 'facilitator'`
- [x] 2.7 Add name truncation with ellipsis for long names
- [x] 2.8 Ensure responsive flex-wrap layout works on 320px screens (4+ avatars per row)

## 3. Page Integration

- [x] 3.1 Replace plain participant `<ul>` list in `Lobby.tsx` with `<ParticipantStrip mode="lobby" />`
- [x] 3.2 Replace "X/Y votes submitted" text in `HostView.tsx` with `<ParticipantStrip mode="voting" />` (and `mode="revealed"` after reveal)
- [x] 3.3 Add `<ParticipantStrip mode="voting" />` to `PlayView.tsx` between round header and card hand (and `mode="revealed"` after reveal)

## 4. Verification

- [x] 4.1 Verify typecheck passes (`npm run typecheck`)
- [x] 4.2 Verify lint passes (`npm run lint`) — 3 pre-existing errors, no new ones
- [x] 4.3 Visual check: Lobby shows avatars for joined participants
- [x] 4.4 Visual check: HostView and PlayView show voting status per participant during voting phase
- [x] 4.5 Visual check: Revealed state shows vote level badges on avatars
- [x] 4.6 Visual check: Layout wraps correctly on narrow viewports (320px)
