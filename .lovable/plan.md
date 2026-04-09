

## Plan: Mobile Fixes for Happy Money Case Study

Three issues to address on mobile (viewport < 768px):

### Issue 1: Constellation — lacks visual connection on mobile
Currently on mobile, the SVG lines and center "DELIVERY" node are hidden (`display: none`), and pill cards become a flat 2x2 grid of boxes. There's no sense of a connected constellation.

**Fix:** Replace the plain grid with a mini radial layout that works at mobile width:
- Keep the center "DELIVERY" circle visible on mobile (smaller, ~64px diameter)
- Show pill cards as a vertical list radiating from center, each connected with a short dashed line segment
- Alternative simpler approach: keep the 2-column grid but add the DELIVERY hub as a centered element above the grid, with short dashed connector lines drawn via CSS `::before` pseudo-elements on each card pointing upward toward center
- Cards get a left border accent (Aspen Gold) instead of full border, maintaining the "connected to hub" visual metaphor

### Issue 2: Iteration Engine (4-phase ribbon) — no arrows or iterative visual on mobile
Currently on mobile, arrows between phases are hidden (`display: none`), the return SVG arrow is hidden, and phases just stack as plain rectangles with no visual flow.

**Fix:**
- Show downward arrows (↓) between stacked phase cards using `::after` pseudo-elements on each ribbon item (except the last)
- After the last phase, render the return arrow as a simple dashed line with "ITERATE" label curving back up, or use a simpler approach: add a visible text/icon element showing "↻ Try. Fail. Learn. Repeat." with the dashed border treatment
- Style the return loop as a dashed border container wrapping the stacked phases to communicate iteration

### Issue 3: System flip cards — text overflowing card boundaries
The flip cards have `min-height: 140px` on mobile but the text content (especially the back side with full body text) exceeds this. The front/back faces use `position: absolute; inset: 0` so they're sized to the card, but the card doesn't grow to fit content.

**Fix:**
- Increase `min-height` for `.hm-flip-card` and `.hm-flip-card-inner` on mobile from `140px` to `200px` (or auto-calculate)
- Add `overflow-y: auto` to `.hm-flip-card-front` as well (back already has it)
- Reduce font sizes on mobile for `.hm-flip-back-body` to help content fit
- Consider reducing padding from `28px 24px` to `16px` on mobile

### Files affected
- `src/styles/case-study.css` — all mobile responsive changes in the `@media (max-width: 768px)` block

### Technical details
- Constellation mobile: Remove `display: none` from `.hm-center-node` on mobile; shrink it; reposition pill cards as a column list with the hub above; add CSS connector lines
- Ribbon mobile: Add `::after` arrow pseudo-elements between stacked items; create a visible iteration indicator below the phases
- Flip cards mobile: Increase min-height, reduce padding/font, ensure overflow handling

