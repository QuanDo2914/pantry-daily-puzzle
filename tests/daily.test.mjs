import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { utcDate, dateMillis, DAY, dayNumber, nextMidnight, countdown, blankProgress, statistics, emptyStore, loadStore, saveStore, shareText, STORAGE_KEY } from '../src/game/daily.js';
import { dailyBoard, supply } from '../server/content.js';
import handler from '../api/daily.js';
import health from '../api/health.js';
import { verifyBaseline } from '../scripts/verify-v3.mjs';

test('UTC schedule is stable across timezone offsets, leap days, and midnight', () => {
  const before = Date.parse('2026-10-20T23:59:59Z');
  assert.equal(utcDate(before), '2026-10-20'); assert.equal(countdown(before), '00:00:01');
  assert.equal(utcDate(nextMidnight(before)), '2026-10-21');
  assert.equal(utcDate(Date.parse('2026-10-20T19:00:00-05:00')), '2026-10-21');
  assert.equal(dayNumber('2024-03-01', '2024-02-28'), 3);
  assert.throws(() => dateMillis('2026-02-30')); assert.throws(() => dateMillis('tomorrow'));
  assert.equal(nextMidnight(before) - dateMillis('2026-10-20'), DAY);
});
test('same date has same V3 board; future answers and experimental datasets excluded', () => {
  for (const mode of ['medium', 'hard']) {
    const a = dailyBoard({ launch: '2026-10-20', date: '2026-10-21', mode });
    assert.deepEqual(a, dailyBoard({ launch: '2026-10-20', date: '2026-10-21', mode }));
    assert.equal(a.id, `v3/2026-10-21/${mode}`); assert.equal(a.number, 2);
    assert.equal(a.recipes.length, mode === 'hard' ? 12 : 8);
    assert.ok(!/solution|nearMiss|icon|optionalSeasonings|expanded/.test(JSON.stringify(a)));
  }
  assert.throws(() => dailyBoard({ date: '2026-10-21' }), /not been configured/);
  assert.throws(() => dailyBoard({ launch: '2026-10-20', date: '2026-10-19' }), /not launched/);
  assert.throws(() => dailyBoard({ launch: '2026-10-20', date: '2027-01-28' }), /not available/);
  assert.throws(() => dailyBoard({ launch: '2026-10-20', mode: 'expanded' }), /Unknown/);
  assert.equal(supply('2026-10-20', Date.parse('2026-10-21T10:00Z')).remaining, 98);
});
test('200 frozen V3 puzzles independently enumerate to their one recorded answer', () => {
  const result = verifyBaseline(); assert.equal(result.boards, 200); assert.equal(result.unique, 200);
});
test('results ledger deduplicates, separates modes and computes out-of-order streaks', () => {
  const store = emptyStore(), solved = { ...blankProgress(), started: true, status: 'solved', seconds: 90, hints: 1 };
  for (const date of ['2026-10-22', '2026-10-20', '2026-10-21']) store.progress[`${date}/medium`] = { ...solved };
  store.progress['2026-10-22/medium'] = { ...solved }; // Same key cannot earn a second result.
  let s = statistics(store, 'medium', '2026-10-22');
  assert.equal(s.solved, 3); assert.equal(s.current, 3); assert.equal(s.longest, 3); assert.equal(s.average, 90); assert.equal(s.hints, 3);
  assert.equal(statistics(store, 'hard', '2026-10-22').played, 0);
  assert.equal(statistics(store, 'medium', '2026-10-23').current, 3);
  assert.equal(statistics(store, 'medium', '2026-10-24').current, 0);
  store.progress['2026-10-23/medium'] = { ...solved, status: 'revealed' };
  s = statistics(store, 'medium', '2026-10-23'); assert.equal(s.solved, 3); assert.equal(s.played, 4); assert.equal(s.winRate, 75); assert.equal(s.current, 0);
  assert.equal(statistics(store, 'medium', '2026-10-20').solved, 1); // Future history not credited today.
});
test('versioned storage recovers safely and preserves unknown/legacy data', () => {
  const data = new Map(), storage = { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
  assert.equal(loadStore(storage).store.version, 2);
  const store = emptyStore(); store.progress['2026-10-20/medium'] = blankProgress();
  assert.ok(saveStore(storage, store)); assert.deepEqual(loadStore(storage).store, store);
  data.set(STORAGE_KEY, '{'); assert.ok(loadStore(storage).readOnly); assert.equal(data.get(STORAGE_KEY), '{');
  data.set(STORAGE_KEY, '{"version":99}'); assert.ok(loadStore(storage).readOnly);
  data.set(STORAGE_KEY, JSON.stringify({ version: 2, progress: { bad: { seconds: -1 } } })); assert.ok(loadStore(storage).warning);
  const denied = { getItem() { throw Error(); }, setItem() { throw Error(); } }; assert.ok(loadStore(denied).warning); assert.equal(saveStore(denied, store), false);
});
test('sharing contains status, day, mode, hints, time, domain, never answers', () => {
  const board = dailyBoard({ launch: '2026-10-20', date: '2026-10-20', mode: 'hard' });
  const text = shareText(board, { ...blankProgress(), status: 'revealed', seconds: 198, hints: 2 }, { current: 0 }, 'https://pantry.test');
  assert.match(text, /Hard · Revealed · 3:18/); assert.match(text, /Hints: 2/); assert.match(text, /https:\/\/pantry.test/);
  for (const r of board.recipes) assert.ok(!text.includes(r.id) && !text.includes(r.name));
});
const response = () => ({ headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; } });
test('public API ignores requested future day and never caches errors', () => {
  const old = process.env.PANTRY_LAUNCH_DATE; process.env.PANTRY_LAUNCH_DATE = utcDate();
  const res = response(); handler({ url: '/api/daily?mode=hard&day=100&date=2099-01-01' }, res);
  assert.equal(res.code, 200); assert.equal(res.body.number, 1); assert.equal(res.body.date, utcDate()); assert.match(res.headers['Cache-Control'], /must-revalidate/);
  delete process.env.PANTRY_LAUNCH_DATE;
  const fail = response(); handler({ url: '/api/daily' }, fail); assert.equal(fail.code, 503); assert.equal(fail.headers['Cache-Control'], 'no-store');
  if (old) process.env.PANTRY_LAUNCH_DATE = old;
});
test('health monitoring rejects unauthenticated callers', async () => {
  const res = response(); await health({ headers: {} }, res); assert.equal(res.code, 401);
});
test('public output excludes private datasets; each daily illustration resolves', () => {
  if (!fs.existsSync('dist')) return;
  const files = fs.readdirSync('dist', { recursive: true }); assert.ok(!files.some(f => /puzzles|100\.json|catalog|solution|proposal/.test(f)));
  for (const mode of ['medium', 'hard']) for (let i = 0; i < 100; i++) {
    const board = dailyBoard({ launch: '2026-10-20', date: utcDate(dateMillis('2026-10-20') + DAY * i), mode });
    for (const asset of [...Object.values(board.art.ingredients), ...Object.values(board.art.recipes)]) assert.ok(fs.existsSync(`dist${asset}`), asset);
  }
});
