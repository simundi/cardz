# UI/UX

## Purpose
Design system conventions, component usage rules, and styling standards. The project uses shadcn/ui as its component library with Tailwind CSS v4 for styling.

## Requirements

### Requirement: shadcn/ui as the design system
All UI MUST be built using shadcn/ui components as the primary building blocks. Before writing custom markup, agents MUST search for an existing shadcn/ui component that fits the need (`npx shadcn@latest search`). Custom components MUST follow shadcn/ui composition patterns.

#### Scenario: Component reuse over custom markup
- **WHEN** a UI element is needed (button, input, dialog, alert, badge, skeleton, etc.)
- **THEN** the corresponding shadcn/ui component SHALL be used instead of custom HTML/CSS

#### Scenario: Search before building
- **WHEN** an agent is about to write custom UI markup
- **THEN** it SHALL first run `npx shadcn@latest search` to check if a component already exists

### Requirement: shadcn skill activation
The shadcn skill is installed at `.claude/skills/shadcn/`. Agents MUST read and follow it when doing any UI work. This skill provides project context, component docs, usage examples, and critical rules.

Agents MUST activate the skill when:
- Adding, updating, or composing shadcn/ui components
- Building forms, overlays, data tables, or any UI pattern that shadcn/ui covers
- Debugging styling or component behavior issues

Agents MUST run `npx shadcn@latest docs <component>` before using any component to ensure correct API usage.

#### Scenario: Skill activation on UI work
- **WHEN** an agent adds, modifies, or composes UI components
- **THEN** it SHALL read the shadcn skill at `.claude/skills/shadcn/SKILL.md` and follow its rules and workflow

#### Scenario: Docs before usage
- **WHEN** an agent uses a shadcn/ui component for the first time in a session
- **THEN** it SHALL run `npx shadcn@latest docs <component>` and review the output before writing code

### Requirement: Component composition conventions
Components MUST follow shadcn/ui composition patterns: composable primitives, `cn()` utility for className merging, and variants via `class-variance-authority`. Components MUST accept a `className` prop for consumer-side overrides.

#### Scenario: className merging
- **WHEN** a UI component receives a `className` prop
- **THEN** it SHALL merge it with internal classes using the `cn()` utility

#### Scenario: Composability
- **WHEN** a UI component is built
- **THEN** it SHALL expose composable sub-components rather than monolithic prop-driven APIs where applicable

### Requirement: Styling rules
All styling MUST use Tailwind CSS utility classes with semantic color tokens. Raw color values, manual dark mode overrides, and deprecated spacing patterns are prohibited.

Key rules:
- Use `gap-*` instead of `space-y-*` or `space-x-*` for spacing
- Use `size-*` instead of `w-* h-*` for equal dimensions
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`), never raw values like `bg-blue-500`
- Use `cn()` for conditional classes, not manual template literal ternaries
- No manual `dark:` color overrides — use semantic tokens that adapt automatically

#### Scenario: Semantic colors
- **WHEN** a color is applied to a UI element
- **THEN** it SHALL use a semantic token (`bg-primary`, `text-muted-foreground`, `border-border`, etc.), never a raw Tailwind color

#### Scenario: Spacing pattern
- **WHEN** vertical or horizontal spacing is needed between elements
- **THEN** `flex` with `gap-*` SHALL be used instead of `space-y-*` or `space-x-*`

### Requirement: Form conventions
Forms MUST use shadcn/ui form primitives: `FieldGroup` + `Field` for layout, `FieldLabel` for labels, and `data-invalid` + `aria-invalid` for validation states. Raw `div` wrappers with manual spacing for form layout are prohibited.

#### Scenario: Form layout
- **WHEN** a form is built
- **THEN** it SHALL use `FieldGroup` and `Field` components for structure, not raw divs

#### Scenario: Validation display
- **WHEN** a form field has a validation error
- **THEN** it SHALL use `data-invalid` on `Field` and `aria-invalid` on the control

### Requirement: Responsive design
All pages and components MUST be fully usable on screens >= 320px wide with no horizontal scroll. Layout MUST adapt gracefully across viewport sizes.

#### Scenario: Minimum viewport
- **WHEN** the app is viewed on a 320px wide screen
- **THEN** all content SHALL be accessible without horizontal scrolling
