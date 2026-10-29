# mal3bna UI design system

## Direction

mal3bna is an energetic court-booking product: deep charcoal surfaces, turf
green actions, lime highlights, and warm coral accents for moments that need
attention. The interface should feel editorial and athletic, with generous
space and clear decisions rather than a generic dashboard template.

## Tokens

- Ink: `#102a2b`
- Surface: `#f4f7f5`
- Card: `#ffffff`
- Turf: `#28785a`
- Lime: `#baf35e`
- Coral: `#ef8f6d`
- Muted: `#61726d`
- Danger: `#a12b2b`
- Success: `#17663e`
- Radius: 10px controls, 16px cards, 32px feature panels
- Spacing: 4px base scale; sections use 24px, 32px, or 48px
- Motion: 180–220ms ease-out; never required to understand state

## Components

Buttons have visible focus rings and a single primary action per region. Cards
carry one decision or one entity. Lists always expose loading, empty, error,
and success states. Forms use labels, strict validation, and server messages.

## Responsive behavior

Desktop uses a two-column discovery hero and three-column venue grid. At 760px
the grid collapses to two columns; at 500px it becomes one column and the
navigation becomes compact. Mobile clients use the same tokens with safe-area
padding and 44px minimum touch targets.

## Roles

Player experiences emphasize discovery, availability, payment, and trust.
Owner experiences emphasize today, calendar, and action queues. Admin
experiences emphasize review queues, money state, audit, and operational
health. The mobile surface never exposes admin navigation.
