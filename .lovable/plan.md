

## Plan: Redesign "How I Build Zero to One" Infinite Loop Visual

### Problem
The current SVG figure-8 is cramped in a 600×280 viewBox with 9px and 6px font sizes. Labels overlap the animated path, the center "ITERATE" circle is too small, and everything is stacked vertically in a narrow column.

### Solution: Horizontal layout with larger, readable elements

**1. Expand the SVG canvas and make it horizontal**
- Change `viewBox` from `0 0 600 280` to `0 0 900 360`
- Increase `max-width` from `600px` to `900px` (or remove cap entirely to use full section width)
- This gives each lobe of the figure-8 much more room

**2. Enlarge all text and circles**
- Phase labels: `9px` → `14px`
- Center "ITERATE" text: `8px` → `14px`
- Center "V1 → V2 → V3" sub-text: `6px` → `11px`
- Center circle radius: `22` → `38`
- Phase dots: radius `4–6` → `7–10`

**3. Move labels outside the path**
- Position phase labels well outside the loop curves (above/below the path, not on top of it)
- Add small connector lines or dots linking labels to their position on the path
- Recalculate label positions: push Discovery/Architecture labels above the loop, Build/Launch labels below

**4. Adjust the figure-8 path geometry**
- Widen the lobes so curves are more generous and less cramped
- Updated path coordinates to use the full 900×360 space

**5. CSS updates**
- `.hm-loop-wrap` max-width → `900px` or `100%`
- All font-size values scaled up proportionally
- Ensure the runner animation `stroke-dasharray` / `stroke-dashoffset` values match the new longer path length

### Files affected
- `src/pages/HappyMoney.tsx` — updated SVG viewBox, path `d` attribute, text positions, circle sizes
- `src/styles/case-study.css` — updated font sizes, circle sizes, max-width for `.hm-loop-wrap`

