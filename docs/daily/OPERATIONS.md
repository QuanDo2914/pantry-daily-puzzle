# Daily content, privacy and growth

## Date contract and release

`PANTRY_LAUNCH_DATE=YYYY-MM-DD` is required on the server. Until configured, the
API returns 503 and never chooses an implicit production date. Date 1 maps to
array entry 0 in both frozen V3 files; date 100 maps to entry 99. All dates are UTC.
Once approved/released, freeze the launch date: changing it would remap saved days.

The API computes the release from server UTC time on each cache miss. This is the
automated publishing mechanism: **no daily frontend build, job, database read, or
manual button** is needed. All actions after the one board download run locally.
Responses exclude stored solutions, internal metrics, icon fields and future days.
The exhaustive browser solver needs only today's public constraints for hints.
Neither the client-selected day nor a client clock can release future content.

Public endpoint: `/api/daily?mode=medium` or `hard`. URL+query caching separates
modes. Cache-Control has browser max-age 0, CDN s-maxage at most 60 seconds and
shorter near midnight; no stale-while-revalidate or stale-if-error. The client
rejects a response whose UTC date is stale. If missing, no wrap/repeat is served.
Private source files are never part of static delivery. The repository itself is
public and already contains historical QA solutions: this is not an anti-cheat
security claim. For genuinely confidential future batches, use private object
storage in a future revision, not a public Git commit.

## Extend beyond 100 days

Do not activate the expanded experiments. Generate candidates offline using the
preserved development generator only after separately authorizing such work.
Supply reviewed paired arrays `{medium:[...],hard:[...]}` with the same canonical
V3 recipes and quantities. Each new board must meet mode sizes and ingredient
counts and exactly one independently enumerated solution. Full existing V3 tests
also enforce original pantry ranges/family rules; importer enforces these below.

```
node scripts/publish-content.mjs /absolute/path/reviewed-batch.json
node scripts/publish-content.mjs /absolute/path/reviewed-batch.json --write
npm run build && npm test && npm run verify:v3 && npm run test:browser
```

The default is dry-run. Explicit write appends `content/approved-extension.json`
atomically. Existing V3 is never edited. Exact duplicate imports are idempotent;
unequal mode imports fail. Review/approve that extension and deploy the server
before it is needed; no *daily* rebuild is required. Date 101 then automatically
maps to the first extension entry. Do not silently invent replacement content.

`/api/health`, authenticated with `Authorization: Bearer CRON_SECRET`, reports
remaining unpublished pairs and last scheduled date. Daily Vercel cron at 00:15
UTC checks it in production. Below 21 days it returns 503 and sends an optional
`PANTRY_ALERT_WEBHOOK` POST (5-second deadline). A failed alert returns 502.
Configure an external uptime monitor with that header and alert recipient as a
second path: cron logs alone do not guarantee a human is notified. Configure and
test this before launch. Preview crons do not run automatically. Webhook receivers
should deduplicate daily low-supply reminders by date; no puzzle keys are sent.

## Guest privacy and future sync

Versioned storage adapter and pure date-ledger derivation separate results from
rendering and content. No guest request authenticates or writes a server result.
Future Supabase: optional sign-in, RLS owned-user rows, unique `(user,date,mode)`
result keys, explicit conflict policy, anonymous/local progress import and export.
Never trust client submissions for a leaderboard. No service role key in browser.
That backend is deliberately not implemented without schema/security credentials.

Future aggregate adapter: daily visit/start/solved/revealed/hint/error events,
only with consent, coarse date+mode and no ingredient selections, solution, email,
recipe IDs or persistent cross-site identity. Production error monitoring must
redact storage/board content. Failures must be caught and non-blocking. DAU,
return rate and completion funnels need a configured privacy-reviewed vendor;
they are not measured yet.

## Scaling path (architecture, not load-test certification)

1k daily players: CDN HTML/CSS/JS/SVG, cached two-mode API; local gameplay.
10k: inspect cache hit rate and server cold-start/error metrics, keep SVG hashes.
100k: verify cache-key/UTC-boundary behavior across regions, load-test burst
traffic, publish immutable released-date JSON to private/CDN-backed storage if
API invocations become material. Introduce atomic signed release manifest.
1m+: capacity/cost test midnight bursts, warm/probe regions, budget request+egress
costs, separate optional accounts writes from anonymous content delivery.
Do not claim one million users supported without measured load/operational tests.
No Kubernetes, Redis, per-click backend, or compulsory user database is needed.
