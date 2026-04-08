

## Plan: Rebuild "How I Build Zero to One" — Side-by-Side Layout

### Current problems
- Constellation SVG: node labels are 7px, circles are 26px radius — everything is tiny and text gets clipped
- Infinity loop SVG: labels overlap the animated path, positioned inside the curves
- Both visuals are stacked vertically — user wants them side by side
- Neither works well at the current scale

### New approach: Two-panel side-by-side layout

```text
┌─────────────────────────────────┬──────────────────────────────────┐
│                                 │                                  │
│   V1 DELIVERY                   │   THE ITERATION ENGINE           │
│   Hub + Spokes                  │   Ribbon Loop + ∞ accent         │
│                                 │                                  │
│   Large center circle "V1"      │   4 big phase cards in a row     │
│   with 7 workstream pills       │   connected by a return arrow    │
│   radiating outward             │   with a soft ∞ watermark        │
│                                 │                                  │
└─────────────────────────────────┴──────────────────────────────────┘
```

### Left panel: Hub + Spokes (replaces constellation SVG)

- **No more SVG diagram.** Replace with HTML/CSS layout.
- Large central circle (forest green, ~120px) with "V1" and "DELIVERY" text inside.
- 7 workstream cards arranged around it using CSS positioning or a simple radial layout — but implemented as positioned HTML elements, not SVG text.
- Each card: a rounded pill/card with the workstream name (e.g. "User Research") in readable 14px+ DM Sans, plus a subtle dot connector line to center.
- On hover: card expands slightly to show the description text (e.g. "Stakeholder interviews · understanding gaps").
- Warm style: cream/sage card backgrounds, soft shadows, forest green center.

### Right panel: Ribbon Loop + decorative infinity

- **4 large phase cards** arranged horizontally in a ribbon:
  - Discovery & Alignment → Architecture & Design → Build & Facilitation → Pilot & Launch
- Each card: ~140px tall, warm cream background, clear typography (16px+).
- Connected by directional arrows between cards.
- A **return arrow** curves from "Pilot & Launch" back to "Discovery & Alignment" below the ribbon, with "ITERATE · V1 → V2 → V3" label on it.
- A **decorative ∞ symbol** rendered as a large, low-opacity SVG watermark behind the ribbon — subtle ambient glow/pulse animation.
- Mantra text below: "Try. Learn. Improve. Repeat."

### Desktop layout
- Use `cs-two-col` pattern (grid: 1fr 1fr) within the section.
- Both panels sit side by side at the full 1080px content width.

### Mobile layout (≤768px)
- Stack vertically: hub first, then ribbon loop below.
- Hub spokes collapse to a simple vertical list with dot markers (reuse existing mobile constellation pattern but with larger text).
- Ribbon phases stack into a 2×2 grid of phase cards with a circular return arrow below.

### Animation
- Subtle ambient only: soft pulse on the center V1 circle, gentle glow on the ∞ watermark, and light opacity fade on connector lines when section scrolls into view.
- No continuous motion on text or cards.

### Files affected
- `src/pages/HappyMoney.tsx` — replace constellation SVG and infinity loop SVG with new HTML/CSS hub-and-spokes + ribbon components
- `src/styles/case-study.css` — new styles for hub layout, spoke cards, ribbon loop, ∞ watermark, mobile breakpoints; remove old `.hm-constellation-*` and `.hm-loop-*` styles

