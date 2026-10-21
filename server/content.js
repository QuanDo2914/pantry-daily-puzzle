import fs from 'node:fs';
import { dayNumber, utcDate, dateMillis, DAY } from '../src/game/daily.js';
import { ingredientAsset, dishAsset } from './art.js';
const root = new URL('../proposals/content-expansion/quality-v3/', import.meta.url);
const batches = Object.fromEntries(['medium', 'hard'].map(mode => [mode, JSON.parse(fs.readFileSync(new URL(`${mode}-100.json`, root)))]));
// Server-only extension file. Appended batches must pass scripts/publish-content.mjs.
const extension = new URL('../content/approved-extension.json', import.meta.url);
if (fs.existsSync(extension)) {
  const more = JSON.parse(fs.readFileSync(extension));
  for (const mode of ['medium', 'hard']) batches[mode].push(...more[mode]);
}
export function supply(launch, now = Date.now()) {
  const total = Math.min(batches.medium.length, batches.hard.length);
  const day = dayNumber(utcDate(now), launch);
  return { total, day, remaining: Math.max(0, total - Math.max(0, day)), lastDate: utcDate(dateMillis(launch) + (total - 1) * DAY) };
}
export function dailyBoard({ launch, date = utcDate(), mode = 'medium', preview = false, publicOrigin = '' }) {
  if (!['medium', 'hard'].includes(mode)) throw Object.assign(Error('Unknown mode'), { status: 400 });
  if (!launch) throw Object.assign(Error('The official launch date has not been configured.'), { status: 503 });
  const number = dayNumber(date, launch), raw = batches[mode][number - 1];
  if (!raw) throw Object.assign(Error(number < 1 ? 'Pantry has not launched yet.' : 'The next verified puzzle is not available. Please check back later.'), { status: 503 });
  return { id: `v3/${date}/${mode}`, date, number, mode, baseline: 'Quality V3', launch, preview, publicOrigin,
    art: { ingredients: Object.fromEntries(Object.keys(raw.pantry).map(id => [id, ingredientAsset(id).path])), recipes: Object.fromEntries(raw.cards.map(r => [r.id, dishAsset(r).path])) },
    pantry: raw.pantry, recipes: raw.cards.map(({ id, name, ingredients }) => ({ id, name, ingredients })) };
}
