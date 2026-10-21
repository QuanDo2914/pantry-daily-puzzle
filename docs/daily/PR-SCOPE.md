# Review scope — daily website, not a production release

This PR targets main from `codex/pantry-daily-website`. It includes the genuine
37e0540 preservation commit already proposed in **unmerged PR #7**, followed by
the active website implementation and its verification hardening. No artificial
commits, backdating, rewritten authors, merges or production deploys.

## Included

Frozen V3 200-board reference/catalog/audit, approved full Clearline SVG source
and visual-only manifest, individually cached current-board art, daily UTC server
delivery, browser gameplay/persistence/results/stats/tutorial/share, safe storage
handling and legacy-save preservation, local-only review controls, independently
validated batch-import/supply pipeline, Node/browser CI, responsive screenshots,
security/cache config, architecture/operations/performance/launch/rollback docs.

## Unchanged or excluded

The pure exact-inventory engine, legacy production puzzle files/catalog and all
frozen V3 bytes are unchanged. Expanded 125/225 experiments, generator runs, 200
expanded boards, V4 content and old previews remain on their original development
branches; none is selected as daily gameplay. No user account backend, unfinished
cloud sync, vendor analytics, secrets, cache folders or generated dist is added.
Only pre-reviewed V3 boards are scheduled; no new content search was performed.

The Clearline art library has expanded identities for future use, but that visual
coverage does not approve their scored content. Static build emits only artwork,
app code and styles; future board/answer JSON is server-side, not public output.

## Approval and deployment warning

This PR **changes the active runtime**. It is not PR #7's runtime-identical scope.
It removes PR #7's permanent global auto-deploy hold. A connected Vercel project's
main-branch merge may automatically create a production deployment. Do not merge
this PR or #7 until the desired deployment behavior is explicitly approved.
The live Sites game has not been published/replaced. A dedicated Vercel preview
project was authorized separately, but actual team access must permit creation.

Verified Git author: Quan Do <minhquando2914@gmail.com>, previously confirmed by
the user's GitHub verified-email settings. Existing attribution/history retained.

## Verification and review links

- [Local playable preview](http://127.0.0.1:4176)
- [24 unit/data checks + 14 browser cases, successful CI](https://github.com/QuanDo2914/pantry-daily-puzzle/actions/runs/39536530668)
- All 200 V3 boards independently verified to one recorded answer.
- Five measured viewport widths: 375/390/430/768/1280 px, no horizontal overflow,
  all art resolved. Desktop/mobile screenshots and measured payload sizes are in
  `docs/daily/`.
- Hosted preview is pending a working Vercel team/CLI authorization. Both safe
  attempts and required configuration are recorded in `DEPLOYMENT.md`.

Keep this PR draft until the user reviews the full playable experience. Do not
merge or deploy to production. Accounts, real vendor analytics/error monitoring,
real-device assistive technology and hosted performance/load tests are not
misrepresented as completed features or measurements.
