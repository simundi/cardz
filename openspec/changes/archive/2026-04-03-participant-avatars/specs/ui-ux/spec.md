## ADDED Requirements

### Requirement: Avatar component in design system
The shadcn Avatar component SHALL be installed and available as a design system primitive. It SHALL be used via `Avatar`, `AvatarImage`, and `AvatarFallback` sub-components following shadcn composition patterns.

#### Scenario: Avatar component available
- **WHEN** a component needs to display a user avatar
- **THEN** it SHALL use the shadcn `Avatar` + `AvatarFallback` components from `src/components/ui/avatar.tsx`
