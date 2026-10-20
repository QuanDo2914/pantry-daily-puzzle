# Main-ready completed work — approval review

This PR is based directly on `main` at `e3c086039983356eb176eec6e83df88c953dfe50`. It extracts completed, inactive assets and the preferred V3 reference from development work without merging Draft PR #2 or its parent experiments.

## Included

| Files | Purpose and production effect |
|---|---|
| `src/visuals/clearline.js` | Completed 125-ingredient / 225-dish SVG library, unchanged from the preserved development commit. Inactive; not imported or shipped by the current build. |
| `docs/clearline/asset-manifest.json` and README | Offline art identity/component manifest and scope notes. No game quantities or expanded playable content. |
| `proposals/content-expansion/quality-v3/` | Frozen 100 Medium / 100 Hard preferred baseline, canonical 150-recipe V3 catalog, historical audit, and a preservation README. Offline only. |
| `tests/clearline-assets.test.mjs` | Complete SVG coverage, presentation, legacy identity compatibility, and non-emoji/external-content checks. |
| `tests/v3-reference.test.mjs` | Canonical quantities, bounds, 200 exhaustive solution checks, and SHA-256 preservation checks. |
| `scripts/check-production-equivalence.mjs` | Rebuilds the PR base in a temporary directory and compares every deployed file path and SHA-256 against this branch. No generation or deployment. |
| `docs/main-review/` and root README | Exact scope, validation, source provenance, and approval boundary. |
| `vercel.json` | Explicit hold on automatic Vercel Git deployments; no build or runtime settings changed. |

## Excluded and preserved elsewhere

The expanded canonical catalog, expanded 200 puzzles, V4 content, optimization generators, candidate pools, diagnostics, caches, preview routes/selectors, UI styling, service-worker changes, PDF exports, screenshots, and unfinished design explorations are excluded from this PR. They remain intact on `codex/pantry-clearline-expansion` and earlier development branches. No content is deleted.

The following existing production paths have no diff against the base: `src/app.js`, `src/index.html`, `src/styles.css`, `src/sw.js`, `src/game/`, `src/data/`, `public/puzzles/`, `scripts/build.mjs`, `package.json`, and `.openai/hosting.json`. The preferred V3 reference is preserved but not activated over current daily content.

## Validation and findings

Use Node 22 (the project's supported minimum is Node 20):

```sh
npm test
npm run build
node scripts/check-production-equivalence.mjs origin/main
git diff --check
```

The equivalence check compares all 208 production files against the exact base commit. All file paths and hashes match. The inventory digest is recorded in `production-equivalence.json`. The new asset library and V3 reference data do not appear in the deployed file set.

All 14 tests pass on Node 22.17.1, including the existing production/engine tests and the new artwork and V3 preservation checks. The production build and whitespace checks pass. Review of the complete diff found no runtime changes; immutable data and artwork were additionally checked against their source fingerprints.

The baseline's historical independent report verifies 200/200 boards. New tests re-enumerate every solution and verify canonical quantities without regenerating data. An existing V3 detail is documented rather than changed: Medium has three pairs with the same card set but different inventories and solutions (97 card sets, 100 solution groups); Hard has 100 of each. No new content-generation optimization has been run.

The copied artwork, catalog, datasets, and historical audit match SHA-256 fingerprints from commit `a0ba4f0e7cb9961c5e956a7abe34a3dab6c1140b`; see `provenance.json`. The new preparation commit represents this actual separation/review work. Earlier branch history is preserved and not rewritten or backdated.

## Will merging deploy to Vercel?

Observed repository evidence: no GitHub Actions workflows, repository webhooks, deployment environments, recorded deployments, Vercel commit statuses, or Vercel check runs were exposed by the GitHub APIs during review. The existing repository hosting config points to OpenAI Sites. These facts alone do not prove that no external Vercel project is connected.

Vercel is installed as a GitHub App on the account. Its repository-access configuration requires GitHub access confirmation, and the Vercel dashboard has no authenticated session available here. The existing Vercel project, selected production branch, and root-directory settings therefore could not be independently confirmed.

For a Vercel project using this repository-root configuration, this PR's `git.deploymentEnabled: false` explicitly prevents automatic Git-triggered deployments from branch pushes and from a later merge into `main`. This holds deployment until a separate approval. It does not invoke a deployment, change an existing live deployment, or alter the build output. Manual deployments or independently configured external deploy hooks are outside this repository flag.

Without that hold, a connected Vercel project normally deploys pushes/merges to its production branch automatically. Official references: [Git configuration](https://vercel.com/docs/project-configuration/git-configuration) and [Git deployments](https://vercel.com/docs/git). Keep the hold until the actual Vercel project settings and deployment approval are confirmed. Do not infer deployment permission from merge approval.

## Approval boundary

The PR is prepared for review only. Do not merge, deploy, activate Clearline in the live UI, switch the live puzzle baseline, or resume experimental content searches without approval. No account settings, integration permissions, or live hosting settings were changed during this review.
