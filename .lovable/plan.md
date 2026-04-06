## Plan: User Guide vILT — Engagement & Readability Overhaul

### 1. Word Cloud — Gentle Float Animation (mobile-safe)
- Words softly drift up/down with CSS keyframes at different speeds/delays
- Subtle opacity pulse to feel "alive"
- On mobile: simpler fade-pulse only (no positional drift to avoid layout issues)

### 2. Quotes — Auto-Rotating Cards
- Remove the ADHD quote (3 remaining)
- Show one quote at a time, auto-fading between them every ~5 seconds
- Subtle fade + slight slide transition
- Pause on hover (desktop)

### 3. Learning Objective Cards — Soft Sage/Muted Green
- Replace Forest Green (`#2C3D2E`) background with a soft sage green (e.g., `#A8B5A0` or `#C2CFBA`)
- Dark Forest Green text on light sage background for contrast
- Applies to all `.cs-thread` cards sitewide (affects Elevate page too)

### 4. Pull Quote — "The User Guide is for everyone..."
- Add a styled pull-quote block between the Situation section and Session Impact
- Large Cormorant Garamond italic, centered, with subtle top/bottom borders
- Text: *"The User Guide is for everyone. You just need to be honest with yourself about how you work — and then give people a way in."*

### 5. Files Changed
- `src/pages/UserGuideVilt.tsx` — remove quote, add pull quote, restructure quotes to rotating
- `src/styles/case-study.css` — word cloud animation, rotating quote styles, sage card colors
