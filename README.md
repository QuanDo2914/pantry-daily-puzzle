# Pantry — daily website review build

Choose the dishes that use your pantry exactly. Medium: 8 cards / 3 picks.
Hard: 12 cards / 4 picks. Same UTC day, same puzzle for everyone.

This dedicated implementation branch integrates **Quality V3**, not experimental
expanded content. The live game and GitHub main are unchanged pending approval.
PR #7's inactive-asset preservation commit is included but was not merged first.

## Play locally

Node **22**, no runtime packages. Playwright is a development dependency.

```
npm ci
npm run check
PANTRY_LOCAL_PREVIEW=1 PANTRY_LAUNCH_DATE=2026-10-21 PORT=4176 npm run dev
```

Open http://127.0.0.1:4176. The configured date is a **local review schedule only**.
Preview tools select existing V3 boards, simulate days, inspect saves, and exercise
missing supply. Production launch date must be chosen separately.

```
npx playwright install chromium
npm run test:browser
```

`npm run check` builds and independently validates without regenerating content.
Legacy `generate`/`validate` commands remain historical tools, not the V3 release
pipeline; do not run a new generation experiment without approval.

## Architecture

- `src/game/engine.js`: preserved exact inventory mechanics and local solver.
- `src/game/daily.js`: UTC dates, safe versioned storage and result-ledger statistics.
- `src/app.js`: Clearline gameplay, guest saves, tutorial, controls, results/share.
- `server/content.js`, `api/daily.js`: server-only V3 schedule, released-day DTO.
- `src/visuals/clearline.js`: original 125 ingredient / 225 dish SVG artwork;
  build creates hash-addressed assets, browser requests only current-board art.
- `scripts/publish-content.mjs`: independent validation and idempotent append of
  reviewed V3-compatible future batches; no expansion activation or new search.
- `api/health.js`: authenticated supply monitor and optional administrator alert.
- `.github/workflows/ci.yml`: build, unit/data verification and browser checks.

Deploying only `dist` to a static host is **not sufficient**: daily delivery needs
the server functions. No future puzzle JSON or solution keys are in `dist`.
No account, cloud backend, or analytics vendor is required for guest play.

## Review documentation

[Features and limitations](docs/daily/README.md) · [Original audit](docs/daily/AUDIT.md)
· [Content operations and scaling](docs/daily/OPERATIONS.md)
· [Deployment/rollback and launch checklist](docs/daily/DEPLOYMENT.md)
· [Verification report](docs/daily/VERIFICATION.md)

The earlier [main-safe preservation review](docs/main-review/README.md) describes
PR #7 only, not this active website implementation. Its production-equivalence
report is historical. This branch intentionally changes the runtime and removes
that PR's permanent global Git deployment hold. Merging into a connected Vercel
production branch can deploy automatically: **do not merge until approved**.

Complete expanded experiments remain on `codex/pantry-clearline-expansion`.
Frozen V3 datasets, original artwork, experimental content and genuine history
are preserved. No production merge, domain cutover or Sites publication is done.
