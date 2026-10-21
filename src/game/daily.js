// UTC dates, persistence, and results are separate from the exact-inventory engine.
export const DAY = 86400000;
export const STORAGE_KEY = 'pantry-daily-v2';
export const utcDate = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);
export function dateMillis(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw Error('Expected a UTC YYYY-MM-DD date');
  const time = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(time) || utcDate(time) !== date) throw Error('Invalid UTC date');
  return time;
}
export const nextMidnight = now => dateMillis(utcDate(now)) + DAY;
export const countdown = now => {
  const s = Math.ceil((nextMidnight(now) - now) / 1000);
  return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':');
};
export function dayNumber(date, launch) { return Math.floor((dateMillis(date) - dateMillis(launch)) / DAY) + 1; }
export const progressKey = (date, mode) => `${date}/${mode}`;
export const blankProgress = () => ({ selected: [], history: [], seconds: 0, hints: 0, hinted: [], started: false, status: 'playing' });
export const emptyStore = () => ({ version: 2, progress: {}, preferences: { motion: 'system' }, tutorialSeen: false });
function validProgress(p) {
  return p && Array.isArray(p.selected) && p.selected.every(x => typeof x === 'string') &&
    Array.isArray(p.history) && p.history.every(a => Array.isArray(a) && a.every(x => typeof x === 'string')) &&
    Number.isFinite(p.seconds) && p.seconds >= 0 && Number.isInteger(p.hints) && p.hints >= 0 &&
    Array.isArray(p.hinted) && p.hinted.every(x => typeof x === 'string') && typeof p.started === 'boolean' &&
    ['playing', 'solved', 'revealed'].includes(p.status);
}
export function loadStore(storage) {
  const clean = emptyStore();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { store: clean, warning: null };
    const parsed = JSON.parse(raw);
    if (parsed.version !== 2) return { store: clean, warning: 'Unrecognized save version. Your original save has not been overwritten.', readOnly: true };
    clean.tutorialSeen = parsed.tutorialSeen === true;
    clean.preferences.motion = ['system', 'reduce'].includes(parsed.preferences?.motion) ? parsed.preferences.motion : 'system';
    let rejected = false;
    for (const [key, p] of Object.entries(parsed.progress || {})) {
      let validDate = false; try { dateMillis(key.slice(0, 10)); validDate = true; } catch { /* malformed record */ }
      if (validDate && /^\d{4}-\d{2}-\d{2}\/(medium|hard)$/.test(key) && validProgress(p)) clean.progress[key] = p;
      else rejected = true;
    }
    return { store: clean, warning: rejected ? 'Some damaged saved progress could not be restored.' : null };
  } catch { return { store: clean, warning: 'Saving is unavailable or the save is damaged. Play can continue in this tab.', readOnly: true }; }
}
export function saveStore(storage, store) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(store)); return true; } catch { return false; }
}
export function statistics(store, mode, today) {
  const entries = Object.entries(store.progress).filter(([key, p]) => key.endsWith(`/${mode}`) && key.slice(0, 10) <= today && p.started);
  const solved = entries.filter(([, p]) => p.status === 'solved');
  const days = solved.map(([key]) => dateMillis(key.slice(0, 10))).sort((a, b) => a - b);
  let longest = 0, run = 0, prev;
  for (const d of days) { run = d === prev + DAY ? run + 1 : 1; longest = Math.max(longest, run); prev = d; }
  let current = 0, cursor = dateMillis(today);
  const daySet = new Set(days);
  if (!daySet.has(cursor)) cursor -= DAY;
  while (daySet.has(cursor)) { current++; cursor -= DAY; }
  if (entries.some(([key, p]) => key.startsWith(today) && p.status === 'revealed')) current = 0;
  const times = solved.map(([, p]) => p.seconds);
  return { played: entries.length, solved: solved.length, winRate: entries.length ? Math.round(solved.length / entries.length * 100) : 0,
    current, longest, average: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null,
    best: times.length ? Math.min(...times) : null, hints: entries.reduce((n, [, p]) => n + p.hints, 0) };
}
export function shareText(board, progress, stats, origin) {
  return `Pantry #${String(board.number).padStart(3, '0')} · ${board.date} UTC\n${board.mode === 'hard' ? 'Hard' : 'Medium'} · ${progress.status === 'solved' ? 'Solved' : 'Revealed'} · ${Math.floor(progress.seconds / 60)}:${String(Math.floor(progress.seconds % 60)).padStart(2, '0')}\nHints: ${progress.hints} · ${stats.current}-day streak\n${origin}`;
}
