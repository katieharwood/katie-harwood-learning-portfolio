

## Plan: Happy Money Case Study — Remove Dates & Ensure Mobile Responsiveness

### Changes

**1. Remove all date references from copy**
In the handoff content for `src/pages/HappyMoney.tsx`:
- Hero eyebrow: change from "CASE STUDY · HAPPY MONEY · 2021" → "CASE STUDY · HAPPY MONEY"
- Lauren's testimonial attribution: remove "· December 2022"
- Eric's testimonial attribution: remove "· November 2022"
- No other date references in body copy (the "8 weeks" timeline is a duration, not a date — keeping it)

**2. Mobile responsiveness built into every section**
All new CSS will include mobile breakpoints (`@media (max-width: 768px)`):
- **Hero**: Two-column layout stacks vertically; pull quote card goes full-width below headline
- **Constellation visualization**: Radial SVG replaced with a vertical stacked list of nodes with connector dots on mobile
- **Module cards**: 2×2 grid collapses to single column
- **Framework cards**: 3-column layout collapses to single column
- **Testimonial cards**: Full-width, reduced padding
- **Timeline bar**: Horizontal scroll or 2×2 grid on narrow screens
- **Typography**: Display headings scale down (clamp or vw-based sizing)
- **Skill tag pills**: Flex-wrap to accommodate narrow widths

**3. Updated plan file (`.lovable/plan.md`)**
Reflect the date removal and mobile requirements.

### Files affected
- `src/pages/HappyMoney.tsx` (new — all copy sans dates)
- `src/styles/case-study.css` (new styles with mobile breakpoints)
- `.lovable/plan.md` (updated plan)

