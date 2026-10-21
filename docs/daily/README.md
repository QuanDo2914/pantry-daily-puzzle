# Pantry daily website — review build

Branch: `codex/pantry-daily-website`. Main and the live Sites deployment are not
changed. PR #7 remains separate/unmerged. [Audit](AUDIT.md) records the actual
vanilla-JavaScript foundation and gaps before implementation.

## Local playtesting

Use Node 22, `npm ci`, then `npm run build`.

```
PANTRY_LOCAL_PREVIEW=1 PANTRY_LAUNCH_DATE=2026-10-21 PORT=4176 npm run dev
```

The date above is an explicitly configured **local test schedule, not the official
launch date**. Open http://127.0.0.1:4176. Test days 1–5, 20, 50, 100 and the safe
missing-content state at day 101. “Next UTC day” moves the preview clock, not your
computer clock. Inspect/export saves, solve both modes, refresh, reveal a day,
and review the separate statistics. Preview storage is namespaced separately
from daily results. Preview controls are enabled only by the local server flag;
the deployed endpoint ignores day/date query parameters, even on Vercel Preview.

## Implemented

- Existing exact-inventory engine, unchanged; frozen V3 100 Medium + 100 Hard.
- UTC schedule, stable date/mode IDs, no random selection or wrapping at day 101.
- Browser-local selection/deselection, Undo, confirmed Reset/Reveal, progressive
  dish hints, exact-only wins, active timer, independent modes and terminal results.
- Versioned local ledger; one result per date/mode, sorted-date streaks, reveals
  excluded from wins, average/best solve times, total hints, export, damage handling.
- Optional interactive onboarding, help, statistics/history, settings and About.
- Spoiler-free clipboard/native sharing; production origin configured server-side,
  preview falls back to its own origin. Native share appears only when supported.
- Clearline prepared dishes/ingredients, distinct quantity/status labels, keyboard
  buttons, native focus-trapped dialogs, reduced-motion support, responsive layouts.
- Hash-addressed SVG files: only current-board art is requested. No gallery,
  catalog, answer key or future board JSON is copied into `dist`.
- Cacheable current-day API with TTL bounded before UTC midnight, no stale fallback,
  launch-unconfigured/missing-content safe failure; retirement of the old broad SW.
- Private extension validator/importer, content supply endpoint and daily cron,
  optional failure-bounded administrator webhook, CI tests/build/browser suite.

## Not claimed complete

- Vercel preview URL, project/domains/environment settings and hosted CDN behavior
  require a connected Vercel project; see [deployment](DEPLOYMENT.md).
- No cloud sync, authentication, analytics vendor, error-monitoring vendor, or
  production credentials are fabricated. Guests need none of those.
- Analytics adapter is a disabled-by-default future integration seam, not live
  analytics. It emits no events without explicit opt-in and an installed adapter.
- No new optimized content batch/search was run. The initial supply is 100 days;
  more reviewed V3-compatible content must be imported before exhaustion.
- Real-user Core Web Vitals, multi-device Safari/Android testing and load capacity
  are not proven by local functional tests or screenshots.
- Medium has 97 distinct card sets but 100 unique solution groups; the three
  reused card sets have different inventories/answers. Original V3 is unchanged.
- Legacy `pantry-v1` data is kept/exportable, not miscredited as new V3 results.
- Local saves are not anti-cheat or a cloud backup; clearing browser data removes
  them. Unknown schema versions are read-only, so a future app can migrate them.

See [operations](OPERATIONS.md), [deployment](DEPLOYMENT.md), and
[verification](VERIFICATION.md) for acceptance gates.
