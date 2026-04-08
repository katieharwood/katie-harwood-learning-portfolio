

## Plan: Redesign "How I Build Zero to One" — New Visual Approach

### What's changing

**Left panel: "Iterative Version Delivery"** (renamed from "V1 Delivery")
- Drop the hub-and-spokes radial layout entirely
- Replace with a clean **numbered list or card grid** of the 7 workstreams — simple, readable, no SVG
- Each workstream gets a card with the name and short description always visible (no hover needed)
- Cards arranged in a compact 2-column grid or stacked list with dot accents

**Right panel: "The Iteration Engine"**
- Keep the 4 phase cards in a 2x2 grid
- Overlay a **dotted circular arrow** (SVG) centered over the 4 cards — a dashed circle with an arrowhead that visually connects the cards in a clockwise loop
- Remove the straight return arrow and infinity watermark
- Add "Try. Fail. Learn. Repeat." below the cards
- Subtle ambient animation: the dotted circle arrow slowly rotates or traces

### Layout
- Both panels remain **side by side** (grid: 1fr 1fr) on desktop
- On mobile (≤768px): stack vertically

### Files affected
- `src/pages/HappyMoney.tsx` — rename panel title, simplify left panel to card grid, replace right panel SVG overlay with circular dotted arrow
- `src/styles/case-study.css` — update hub styles to simple grid, add circular arrow overlay styles, remove unused hub/spoke/infinity CSS

