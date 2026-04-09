

## Plan: Replace Compass with True Vector SVG + Recolor

### What's happening
The new compass file (`file_1.svg`) is proper vector line art — all paths use `stroke="#000000"` with `fill="none"`. Unlike the previous compass files that had rasterized PNGs embedded inside, this one can be recolored with a straightforward text replacement.

### Steps

1. **Copy the uploaded SVG** into `src/assets/triptych-retention.svg` (replacing the current broken raster version)
2. **Recolor lines**: Replace all `stroke="#000000"` with `stroke="#7A9E7E"` (Sage green)
3. **Add cream background**: Insert a `<rect>` element with `fill="#F5F2EC"` behind the paths
4. **Verify** the door SVG stroke-width fix from earlier is still in place

### Files affected
- `src/assets/triptych-retention.svg` — replaced entirely with the new vector compass, recolored to Sage on cream

No changes to `HappyMoney.tsx` or CSS — the import already points to this file.

