# Verification log

## Confirmed locally

- Production build completes. Static code ~40 KB raw / ~14.2 KB gzip before
  current-board individually cacheable SVGs and ~3 KB board JSON.
- 23 unit/data/asset tests passed, including both legacy and frozen V3 checks.
- Fresh independent verifier (no engine/generator imports): **200 / 200** V3
  puzzles have exactly their one recorded solution, ~83 ms on this machine.
- Original V3 files and Clearline renderer match provenance SHA-256 fingerprints.
- Static output excludes catalog, experimental data, answer keys and future boards.
- All current-board asset paths across all 200 V3 boards resolve in the build.
- In-app browser: onboarding, live selections, separate mode restoration and Undo
  exercised. Actual viewport dimensions checked at 375, 390, 430, 768 and 1280 px;
  each has 12 Hard cards, zero missing images and no horizontal overflow. Quantity
  typography is 14 px. Corrected screenshots are saved in `screenshots/`.

## Browser runner environment

The local standalone Playwright launch was blocked before any test ran by macOS
MachPort sandbox permission (both installed Chrome and cached headless Chromium).
This is **not a passing browser run**. A full committed Playwright suite runs in
GitHub Ubuntu CI, including exact Medium/Hard solves, refresh, reveal, hint/reset,
sharing, storage failure, midnight rollover and five viewport widths. CI must
finish successfully before recommending production. No retry/optimization loop
is used to conceal failed verification.

**GitHub CI passed**, including the full Playwright suite, on implementation
commit 0d0e74d: [run 39535603171](https://github.com/QuanDo2914/pantry-daily-puzzle/actions/runs/39535603171).
This removes the standalone local runner blocker for functional browser checks;
real-device and hosted performance checks remain distinct launch gates.

## Performance and accessibility scope

Build sizes are measured locally, not a production performance claim. Functional
browser screenshots do not establish Core Web Vitals or load capacity. Measure
LCP/CLS/INP on the actual Vercel Preview and real phone networks before launch.
System font avoids external font downloads; art is requested only for this board;
selection/hints/stats do not call a backend. No third-party analytics is loaded.
Native buttons provide keyboard selection; focus indicators, text status labels,
native dialog containment, reduced-motion CSS and visible quantities are present.
Manual assistive-technology and real-device tests remain launch acceptance gates.

## Frozen reference digests

Medium: `3f7cbaf75221d4b622445b1de59955628245b27c7eb4029726a0c617edb1831b`

Hard: `155992a469cbdc8bcf48d97f4cbfadaab2d8f7a9ad1b3cc8678b04e52f95567b`
