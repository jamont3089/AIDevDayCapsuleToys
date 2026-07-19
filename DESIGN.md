# Design System

## Direction

**Scene:** a powder-coated capsule machine has been rolled beside an espresso counter under bright conference-hall lights; it should read instantly from six feet away and reward closer inspection.

**Aesthetic:** “kissaten vending machine meets modern exhibit fabrication.” Chunky type, physical controls, printed instruction labels, visible hardware, and a dense chamber of names. The work is tactile rather than nostalgic, and playful rather than childish.

## Color

Full-palette strategy anchored by the generated 7-degree red seed.

```css
--color-bg: oklch(0.975 0.006 7);
--color-surface: oklch(1 0 0);
--color-ink: oklch(0.18 0.035 22);
--color-muted: oklch(0.43 0.045 18);
--color-primary: oklch(0.62 0.22 7);
--color-primary-dark: oklch(0.43 0.17 7);
--color-accent: oklch(0.86 0.18 92);
--color-coffee: oklch(0.29 0.07 48);
--color-mint: oklch(0.78 0.12 172);
--color-info: oklch(0.52 0.15 248);
--color-error: oklch(0.52 0.2 25);
```

Red belongs to the machine body and primary action. Acid-yellow marks physical controls and winner moments. Coffee brown anchors the product story. Mint is reserved for successful loading and live status.

## Typography

- Display: **Dela Gothic One**, a heavy Japanese display face with the blocky presence of molded machine lettering.
- Body/UI: **Zen Kaku Gothic New**, a clear Japanese gothic with a quieter, human cadence.
- Display headings use fluid sizing with a 1.333 scale and a maximum of 5rem.
- Body text remains at least 1rem with 1.6 line height and a 65ch maximum measure.

## Layout

- Mobile first; the hero machine follows the entry copy so the CTA stays in the first viewport.
- At 900px and wider, the hero becomes an asymmetric two-column composition with copy offset above the machine.
- Section rhythm alternates between dense mechanical assemblies and open explanatory space.
- Controls use 44px minimum targets and remain reachable without hover.

## Components

- **Capsule machine:** semantic HTML plus SVG/CSS illustration; the chamber is populated from live entry data.
- **Entry control:** a clearly labeled name field that validates, saves locally, and drops a capsule into the machine immediately.
- **Status strip:** communicates the locally saved entry count without requiring connectivity.
- **Host console:** a native dialog with random draw, winner history, CSV backup, deliberate entry clearing, and copy controls.
- **Language switch:** a compact EN/日本語 segmented control that updates all interface strings and document metadata.

## Motion

One signature choreography: capsules settle into the chamber on load, and the chosen capsule travels through the chute during a draw. Micro-interactions use 100–250ms feedback; the draw uses a bounded 1.8-second sequence. Reduced motion replaces travel and shaking with immediate state changes and a short crossfade.

## Illustration

Use custom SVG and CSS to create the machine, coffee bag, chrome hardware, and capsule forms. This is the product imagery, not a placeholder. Avoid emoji, stock icon mixtures, and decorative gradients.
