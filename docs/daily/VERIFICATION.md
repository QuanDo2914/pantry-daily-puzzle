# Verification log

## Confirmed locally

- Production build completes. Static code ~40 KB raw / ~14.2 KB gzip before
  current-board individually cacheable SVGs and ~3 KB board JSON.
- 24 unit/data/asset tests passed, including both legacy and frozen V3 checks.
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

**GitHub CI passed**, including all **14 Playwright cases in 16.3 seconds**, on
commit 55a6ca3: [run 39536530668](https://github.com/QuanDo2914/pantry-daily-puzzle/actions/runs/39536530668).
The suite includes keyboard interaction and axe checks with zero reported game /
help-dialog violations. Axe initially detected visible-label/name mismatches;
the markup was corrected and the check retained, not suppressed.
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

Measured single local cold API samples (not load tests / Vercel measurements):

| Mode | Local response | JSON raw / gzip | Unique SVG requests | SVG raw / gzip |
| --- | ---: | ---: | ---: | ---: |
| Medium, day 1 | 39.24 ms | 2,201 / 800 B | 19 | 22,548 / 8,929 B |
| Hard, day 1 | 5.94 ms | 2,969 / 1,007 B | 25 | 34,778 / 12,390 B |

App core gzip is 14,294 B across HTML/CSS/JS/favicon/worker, before board+art.
Gzip sizes are computed from build bytes, not a guarantee of transport encoding.
Hashed SVG responses are configured for one-year immutable caching. Full library
source is not downloaded by ordinary gameplay. Hosted Web Vitals remain pending.

## Frozen reference digests

Medium: `3f7cbaf75221d4b622445b1de59955628245b27c7eb4029726a0c617edb1831b`

Hard: `155992a469cbdc8bcf48d97f4cbfadaab2d8f7a9ad1b3cc8678b04e52f95567b`
