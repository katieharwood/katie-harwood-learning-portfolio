

## Plan: Recolor SVG Illustrations for Triptych Cards

### What we're doing
The three uploaded SVGs (15.svg, 16.svg, 17.svg) are line illustrations for the Retention, Tooling, and Readiness triptych cards. We need to change the line/path colors from black to Sage green and ensure the background is cream.

### Color changes
- **Lines/strokes**: `#000000` → `#7A9E7E` (Sage)
- **Background**: Already `#f5f2ec` (cream) in files 16 and 17. File 15 needs the background rects added or verified.

### How it works
Each SVG uses `#000000` in either `fill` or `stroke` attributes on `<path>` elements:
- **16.svg** (Tooling): Uses `fill="#000000"` on filled paths
- **17.svg** (Readiness): Uses `stroke="#000000"` on stroked paths
- **15.svg** (Retention): Uses filled paths — needs metadata stripped and color replaced

### Steps

1. **Copy all 3 SVGs** into `src/assets/` (e.g., `triptych-retention.svg`, `triptych-tooling.svg`, `triptych-readiness.svg`)
2. **Run a script** to replace `#000000` with `#7A9E7E` in all three files, and also replace `stroke="#000000"` and `fill="#000000"` variants
3. **Strip the c2pa metadata** from 15.svg (it's bloating the file significantly — the actual illustration is buried under ~160K of base64 certificate data)
4. **Ensure background rects** are `#f5f2ec` in all three
5. **Update `HappyMoney.tsx`** — import the three SVGs and add `<img>` tags inside each triptych card, positioned above the card title
6. **Add CSS** for the illustration sizing (e.g., `max-height: 180px`, centered, with some bottom margin)

### Files affected
- `src/assets/triptych-retention.svg` — new file (from 15.svg, recolored)
- `src/assets/triptych-tooling.svg` — new file (from 16.svg, recolored)
- `src/assets/triptych-readiness.svg` — new file (from 17.svg, recolored)
- `src/pages/HappyMoney.tsx` — import and render illustrations in triptych cards
- `src/styles/case-study.css` — optional sizing styles for triptych illustrations

