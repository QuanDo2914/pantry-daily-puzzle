# Preview, launch and rollback

No merge, production deployment, production domain, or live Sites change is
authorized by this implementation. The existing `.openai/hosting.json` is retained
but no Sites publish command is run. A static-only Sites host cannot serve this
server API; do not upload `dist` alone as the live daily game.

## Vercel audit

GitHub `main` remains e3c0860; PR #7 is not merged. It proposes a global
`git.deploymentEnabled:false`. This implementation removes that permanent hold
and uses normal Git deployments. A merge into a connected Vercel project's
production branch **can automatically deploy**. Approving this PR is not a safe
way merely to add green contributions while keeping the live runtime unchanged.

On 20 October (local) Vercel GitHub sign-in succeeded; Quan's org Hobby showed
CampusStack only. There was no existing Pantry project to inspect or reuse. The
user separately approved a dedicated **preview-only** Pantry project. Do not
reuse CampusStack, attach the live domain, or run `vercel --prod`.

The Vercel connection was subsequently installed and could list CampusStack,
confirming team `team_y99qMOYpnk7EYiZGmqSfjXhd`, but project creation returned
403 `grant_team_access`, including a retry after the user reported granting it.
The official CLI fallback had no stored credentials and requested device login.
No successful project creation or deployment is claimed until its returned state
confirms it. Never work around a team grant by using the unrelated project or a
different default scope. Authorization completion remains the hosting blocker.

Required Vercel project: repository root here, framework Other, Node 22, build
`npm run build`, output `dist`, server functions `api/*.js`. Source tracing includes
the private V3 JSON and optional extension. Lockfile is committed. GitHub Actions
checks content, source, production build, and Playwright independently of Vercel.

Preview environment only:

- `PANTRY_LAUNCH_DATE`: explicit review schedule (not official production date).
- `PANTRY_PUBLIC_ORIGIN`: preview URL for preview sharing, approved real domain
  for production later; never a placeholder example domain.
- `CRON_SECRET`: server-only randomly generated credential, no frontend prefix.
- `PANTRY_ALERT_WEBHOOK`: optional server-only administrator notification URL.

Do not copy Preview values into Production without approval. Deploy with the
Preview target and verify API mode/date, 503 with missing config, source-file 404,
artifact coverage, cold start, caching/date transition, and narrow viewport flows.
Account/sync/analytics keys are not necessary for guest play.

Official references:
[Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration),
[static config and function includeFiles](https://vercel.com/docs/project-configuration/vercel-json),
[cron authentication and monitoring](https://vercel.com/docs/cron-jobs/manage-cron-jobs).
Cron schedules are production-only; health must be invoked manually on Preview.

## Launch checklist — requires explicit approval

- [ ] User approves the playable preview, content baseline and UX.
- [ ] Vercel isolated preview is verified, CI and browser checks pass.
- [ ] Official UTC launch date and actual production origin chosen.
- [ ] Existing Vercel project Git/root/production branch and domain configuration
      inspected; check for automatic deployment before pressing Merge.
- [ ] V3 duplicate-card-set caveat accepted; source files remain immutable.
- [ ] Supply monitor and a real alert delivery test pass; replenishment owner named.
- [ ] Storage, screen reader, Safari/iOS/Android and actual player tests completed.
- [ ] No exposed credentials; future datasets absent from public build.
- [ ] CDN current-day behavior, observed Web Vitals and burst budget reviewed.
- [ ] Prior deployment recorded and rollback rehearsal done on preview.
- [ ] Explicit permission to merge AND launch obtained.

## Rollback

Record the known-good production deployment ID and environment values before
release. Re-promote that deployment in Vercel if the new runtime fails. Do not
change the launch date, mutate the canonical V3 datasets, force-push Git history,
or purge player storage. The legacy save key is untouched and the new schema is
versioned. Revert the implementation via a reviewed commit/PR for subsequent
deploys, rather than deleting experimental development history. The old live
Sites host stays unchanged until a separately approved domain cutover.
