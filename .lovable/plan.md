

## Plan: Fix Two Bugs

### Bug 1: Workstream cards invisible on Happy Money page
**Root cause**: `.hm-workstream-card` starts at `opacity: 0`. The `.visible` class triggers `animation: spokeAppear 0.4s`, but the `@keyframes spokeAppear` rule was never defined in `case-study.css`. The animation does nothing, so cards remain invisible.

**Fix** in `src/styles/case-study.css`:
- Add `@keyframes spokeAppear` that goes from `opacity:0; transform:translateY(8px)` to `opacity:1; transform:translateY(0)`.

### Bug 2: Home page project scroll only shows 2 items
**Root cause**: The initial reveal animation (lines 99-103 in Index.tsx) adds class `visible` to `.project-item` elements in the DOM at load time. But when the user clicks the scroll arrow, `projectOffset` changes and React re-renders a new slice of projects. The newly rendered items never get the `visible` class from the reveal (it already ran), so they stay at `opacity: 0; transform: translateY(10px)`.

The Link-based items use `className="project-item visible-link"` but there's no CSS rule for `.visible-link` — only `.project-item.visible` makes them opaque.

**Fix** in `src/pages/Index.tsx`:
- After the initial reveal animation completes, ensure all project items are always visible. Simplest approach: add `visible` class to all project items unconditionally once the reveal has finished (use a state flag like `revealDone`), so that scrolled-in items are immediately visible.

### Files affected
- `src/styles/case-study.css` — add missing `@keyframes spokeAppear`
- `src/pages/Index.tsx` — ensure scrolled project items get visibility after initial reveal

