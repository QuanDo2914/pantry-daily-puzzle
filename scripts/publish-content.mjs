import fs from 'node:fs';
import assert from 'node:assert/strict';
import { independentlyValidate } from './verify-v3.mjs';
// Operator supplies pre-reviewed canonical V3 batches. This is validation and
// scheduling, NOT an optimization search. No files change without --write.
const file = process.argv[2];
if (!file) throw Error('Usage: node scripts/publish-content.mjs reviewed-batch.json [--write]');
const incoming = JSON.parse(fs.readFileSync(file)), target = new URL('../content/approved-extension.json', import.meta.url);
const previous = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target)) : { medium: [], hard: [] };
const catalog = JSON.parse(fs.readFileSync(new URL('../proposals/content-expansion/quality-v3/proposed-recipe-catalog.json', import.meta.url))).recipes;
const canonical = new Map(catalog.map(r => [r.id, r]));
assert.ok(incoming.medium.length > 0 && incoming.medium.length === incoming.hard.length);
const merged = { medium: [], hard: [] };
for (const mode of ['medium', 'hard']) {
  const baseline = JSON.parse(fs.readFileSync(new URL(`../proposals/content-expansion/quality-v3/${mode}-100.json`, import.meta.url)));
  const signature = b => JSON.stringify({ pantry: Object.entries(b.pantry).sort(), cards: (b.cards || b.recipes).map(r => r.id).sort() });
  const seen = new Set([...baseline, ...previous[mode]].map(signature));
  for (const board of incoming[mode]) {
    independentlyValidate(board, mode);
    const types = Object.keys(board.pantry).length;
    assert.ok(mode === 'medium' ? types >= 8 && types <= 12 : types >= 12 && types <= 16, 'Pantry range');
    const families = new Map();
    for (const card of board.cards || board.recipes) { const recipe = canonical.get(card.id); assert.ok(recipe, `Not V3: ${card.id}`); assert.equal(card.name, recipe.name); assert.deepEqual(card.ingredients, recipe.variants[mode]); }
    for (const card of board.cards || board.recipes) { const family = canonical.get(card.id).family; families.set(family, (families.get(family) || 0) + 1); }
    assert.ok(families.size >= (mode === 'medium' ? 6 : 7) && Math.max(...families.values()) <= 2, 'V3 family diversity');
    const sig = signature(board); if (seen.has(sig)) continue; // Idempotent exact re-import.
    seen.add(sig); merged[mode].push({ ...board, mode, cards: board.cards || board.recipes });
  }
}
assert.equal(merged.medium.length, merged.hard.length, 'Uneven duplicate imports; supply paired fresh batches');
if (process.argv.includes('--write') && merged.medium.length) {
  for (const mode of ['medium', 'hard']) previous[mode].push(...merged[mode]);
  fs.mkdirSync(new URL('../content/', import.meta.url), { recursive: true });
  const temp = new URL('../content/approved-extension.json.pending', import.meta.url);
  fs.writeFileSync(temp, JSON.stringify(previous, null, 2) + '\n'); fs.renameSync(temp, target);
}
console.log(JSON.stringify({ validatedPairs: incoming.medium.length, newPairs: merged.medium.length, wrote: process.argv.includes('--write') }));
