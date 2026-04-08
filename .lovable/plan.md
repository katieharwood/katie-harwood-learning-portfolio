

## Plan: Happy Money Case Study — Scannability & Iterative Loop Overhaul

### 1. Hero quotes — rotate both testimonials in speech bubble

Move Lauren and Eric's quotes into the hero section using the same speech-bubble + auto-rotate pattern from the User Guide case study. Reuse the existing `cs-speech-bubble`, `cs-testimonial-rotator`, `cs-testimonial-slide`, `cs-testimonial-dot` CSS classes. Remove the entire "In Their Words" section (Section 5).

**Quotes (2):**
- Lauren Benton-Cissel — existing hero quote
- Eric Saggese — existing editorial quote

### 2. System section — flip cards for scannability

Replace the current module cards, framework cards, and operational tool cards with flip cards:

- **Front**: Title + one-line tagline (e.g. "How We Launch" / "60-min workshop on onboarding philosophy & the critical Handoff")
- **Back**: Full description text (current body copy)
- Click/tap to flip. On mobile, tap toggles.

This applies to all three card grids:
- 4 module cards (2×2)
- 3 framework cards (3-col)
- 3 operational tool cards (3-col)

Each card gets a CSS 3D transform flip effect. Front uses the existing sage/cream palette; back uses a slightly darker treatment to signal depth.

### 3. Iterative loop — animated infinite loop visual

Replace the static timeline bar (Week 1–2 through Week 7–8) with an animated infinite loop (figure-8 / Möbius-style path) showing the four phases flowing continuously:

**Discovery & Alignment → Architecture & Design → Build & Facilitation → Pilot & Launch → (loop back)**

- SVG path animation that traces the loop continuously
- Phase labels positioned along the path
- A subtle "V1 → V2 → V3" counter or marker that pulses at the launch point, showing each iteration
- Annotation text: "Try. Learn. Improve. Repeat." or similar
- On mobile: simplified to a vertical circular flow diagram

The existing constellation stays — this replaces only the timeline bar beneath it.

### Files affected
- `src/pages/HappyMoney.tsx` — hero speech bubble, remove In Their Words section, flip card components, infinite loop SVG
- `src/styles/case-study.css` — flip card 3D transforms, infinite loop animation keyframes, speech bubble styles (reuse existing)

