# Quality V4 isolated pilot

This directory is experimental. Nothing here is loaded by the production Pantry app.

- `candidate-recipe-catalog.json`: 150 canonical recipes; Medium unchanged from V3, 25 Hard adjustments.
- `recipe-changes.json`: exact before/after maps for all 25 adjustments.
- `hard-pilot.json`: 25 Hard test boards.
- `independent-verification.json` / `.md`: exhaustive independent audit.
- `benchmark.json` and `pilot-review.md`: generation and comparative findings.
- `screenshots/`: 375 px, 430 px, and desktop captures.

From the repository root, run `node proposals/content-expansion/quality-v4/preview/server.mjs`, then open `http://127.0.0.1:4175/proposals/content-expansion/quality-v4/preview/index.html`. The server binds only to `127.0.0.1` and serves files read-only. Stop it with Ctrl-C when finished.

No full V4 batch was generated. Do not integrate or deploy this catalog without explicit approval.
