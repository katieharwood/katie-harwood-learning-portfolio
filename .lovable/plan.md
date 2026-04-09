

## Plan: Fix Compass Color + Make Door Lines Thicker

### Two issues to fix

**1. Compass (Readiness card) — still black lines**
The new compass SVG (`compass_with_no_needle.svg`) has the same problem as the previous one: the illustration is a rasterized PNG embedded as base64 inside the SVG, not true vector paths. Text-based find-and-replace cannot change pixel colors.

**Fix:** Use a Python script (Pillow) to:
- Extract the embedded base64 PNG from the SVG
- Replace all dark/black pixels with Sage green (#7A9E7E), preserving transparency and antialiasing
- Strip the ~160KB of c2pa certificate metadata
- Re-encode and save as `src/assets/triptych-retention.svg` (which the Readiness card imports)

**2. Door (Retention card) — lines too thin**
The door illustration is a true vector SVG with `stroke-width="3"` on all paths. At the rendered card size (~180px tall), these lines appear very faint.

**Fix:** Find-and-replace `stroke-width="3"` → `stroke-width="5"` (or `6`) in `src/assets/triptych-readiness.svg` to make the lines visibly bolder. Can also slightly increase the stroke opacity if needed.

### Files affected
- `src/assets/triptych-retention.svg` — rebuilt from new compass upload, raster-recolored to Sage
- `src/assets/triptych-readiness.svg` — stroke-width increased for bolder door lines

No changes needed to `HappyMoney.tsx` or CSS — imports are already correctly mapped.

