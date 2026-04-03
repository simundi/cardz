# spec: participant-avatars
STATUS: Draft · CHANGE: participant-avatars

## Purpose
Define how participants are visually represented as avatars throughout the application, including the ParticipantStrip component that displays all session participants with context-dependent status indicators.

## 1. Avatar display

### Requirements

REQ-50: The system SHALL display each participant as an avatar with 2-letter initials using the shadcn Avatar component with AvatarFallback. Initials SHALL be derived from the participant's name: first letter of first word + first letter of second word (if exists), or first two letters if single word. Initials SHALL be uppercase.

### Scenarios

SCENARIO U — Two-word name initials
WHEN a participant named "Alice Johnson" is displayed
THEN the avatar SHALL show "AJ" as initials

SCENARIO V — Single-word name initials
WHEN a participant named "Bob" is displayed
THEN the avatar SHALL show "BO" as initials

## 2. ParticipantStrip component

### Requirements

REQ-51: The system SHALL provide a `ParticipantStrip` component that displays all session participants as a horizontal flex-wrap layout of avatars. Each avatar item SHALL show the avatar, the participant's name (truncated if longer than the item width), and a context-dependent status indicator. The component SHALL accept a `mode` prop with values `lobby`, `voting`, or `revealed`.

### Scenarios

SCENARIO W — Lobby mode display
WHEN the ParticipantStrip is rendered with `mode="lobby"`
THEN each participant SHALL be displayed as an avatar with their name below it
AND no voting status SHALL be shown

SCENARIO X — Voting mode display
WHEN the ParticipantStrip is rendered with `mode="voting"`
THEN participants who have submitted a vote SHALL show a primary-colored ring on their avatar, a check badge, and "Voted" text
AND participants who have not voted SHALL show a muted/faded avatar and "Waiting" text

SCENARIO Y — Revealed mode display
WHEN the ParticipantStrip is rendered with `mode="revealed"`
THEN each participant's avatar SHALL display their vote level number as a badge
AND the participant's name SHALL be shown below the avatar

## 3. Facilitator distinction

### Requirements

REQ-52: The system SHALL visually distinguish the facilitator from other participants in the ParticipantStrip. The facilitator SHALL display a "Host" label to differentiate their role.

### Scenarios

SCENARIO Z — Facilitator identified in strip
WHEN the ParticipantStrip is rendered
THEN the participant with `role: 'facilitator'` SHALL display a "Host" label
AND all other participants SHALL NOT display the "Host" label

## 4. Responsive layout

### Requirements

REQ-53: The ParticipantStrip SHALL use a horizontal flex-wrap layout with centered alignment. Each avatar item SHALL have a fixed width (~64-72px) to ensure predictable wrapping. The layout SHALL be fully usable on screens >= 320px wide with no horizontal scrolling, fitting at least 4 avatars per row.

### Scenarios

SCENARIO AA — Narrow viewport wrapping
WHEN the ParticipantStrip is displayed on a 320px wide screen with 8 participants
THEN avatars SHALL wrap to multiple rows without horizontal scrolling
AND at least 4 avatars SHALL fit per row

## 5. Name truncation

### Requirements

REQ-54: Participant names that exceed the avatar item width SHALL be truncated with an ellipsis to prevent layout overflow.

### Scenarios

SCENARIO AB — Long name truncation
WHEN a participant named "Bartholomew Christopher" is displayed
THEN the name SHALL be truncated with an ellipsis to fit within the item width
