# Pantry Quality V3 — Isolated Proposal

Nothing in this directory is imported by the live game. No deployment or production data was changed.

## Final preserved batch

- `medium-100.json` — 100 scheduled Medium puzzles.
- `hard-100.json` — 100 scheduled Hard puzzles.
- `samples/medium.json`, `samples/hard.json` — five examples per mode.
- `proposed-recipe-catalog.json` and `catalog-changes.json` — explicit, unapproved scoring definitions used by this batch.

## Verification and reports

- `independent-verification.md` / `.json` — separate exhaustive validator results.
- `benchmark.json` — attempts, rejection reasons, runtime, difficulty, frequency, family, ingredient, streak, and rolling-window statistics.
- `v2-v3-comparison.md` / `.json` — measured comparison.
- `diversity-report.md` / `.json` — recipe, family, ingredient, adjacency, streak, and rolling-window analysis.
- `pantry-range-comparison.md` / `.json` — bounded feasibility screening with explicit limitations.
- `difficulty-analysis.md` / `.json` — near-miss and deduction-depth results.
- `samples.md` — human-readable sample boards.
- `overlap-graph-medium.json`, `overlap-graph-hard.json` — per-recipe connectivity, candidate inclusion, schedule use, and exclusion reasons.
- `feasibility-365.md` — long-term assessment.
- `production-readiness.md` — achieved/missed targets and recommendation.

## Reproduce the preserved configuration

```sh
PANTRY_V3_POOL=2200 PANTRY_V3_HARD_MAX=16 PANTRY_V3_CATALOG=trim-core PANTRY_V3_ANCHOR_TRIALS=6000 node proposals/content-expansion/quality-v3/generate-v3.mjs
node proposals/content-expansion/quality-v3/independent-verify.mjs
node proposals/content-expansion/quality-v3/build-reports.mjs
```

Answer-pool caches live under `/private/tmp`. A cached final generation run measured 56.44 seconds. Do not launch a new large search without explicit approval.
