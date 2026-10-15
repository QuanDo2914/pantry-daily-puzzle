# Pantry

Pantry is a polished daily deduction game: choose a fixed number of recipe cards whose combined ingredients use the pantry exactly. Medium presents 8 cards / 3 picks; Hard presents 12 cards / 4 picks. Every published puzzle is exhaustively checked for one unordered solution.

## Run locally

Requires Node 20 or newer and no third-party runtime dependencies.

```bash
npm run check
npm run dev
```

Open `http://localhost:4173`. The launch date is configured as `LAUNCH` in `src/app.js`; all day calculations use UTC.

## Content pipeline

```bash
npm run generate   # deterministic seed → 100 Medium + 100 Hard JSON files
npm run validate   # exhaustive solution, schema, hint and structure checks
```

The curated base catalog and its named portion variants live in `src/data/catalog.js`. Generation selects an intended menu, calculates the pantry, chooses feasible overlapping decoys, enumerates all 56/495 possible selections, rejects ambiguity, screens Hard boards for near misses, and computes a rename-invariant weighted graph signature. Future days can be added by increasing the day limit in `scripts/generate-puzzles.mjs`; generated days never silently cycle.

Public puzzle files contain the board and progressive hints but not stored solution IDs. Private answers, signatures, and quality metrics remain in `reports/puzzle-validation.json`, which is excluded from the deployment archive. Since the deployment is static, a determined visitor can still enumerate the current board (and discover publicly hosted future JSON URLs). Strict future-day embargoing would require a server-side daily endpoint.

## Storage and privacy

No account or backend is required. Selections, active time, hints, theme, tutorial state, mode-specific results, statistics, and streaks are stored in one versioned localStorage record. Malformed storage falls back safely. Medium and Hard are keyed independently by puzzle ID and mode.

## Deployment

`npm run build` creates `dist/`. Deploy that directory to any static host (Vercel preset: “Other”, build command `npm run build`, output `dist`). Client routing falls back through `404.html`. The included `.openai/hosting.json` supports OpenAI Sites publication.

## Architecture

- `src/game/engine.js`: pure inventory, validation and exhaustive search functions
- `src/app.js`: daily scheduling, persistence, timer, statistics and interaction layer
- `src/styles.css`: responsive, accessible light/dark visual system
- `scripts/`: deterministic generation, validation, build and local preview
- `tests/`: engine and complete content-bank checks
- `reports/`: machine-readable and human-readable validation output
