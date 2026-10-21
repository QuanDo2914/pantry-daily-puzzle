import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
// Independent verifier: no imports from the app engine, generator, or evaluator.
export function independentlyValidate(board, mode) {
  const cards = board.cards || board.recipes, picks = mode === 'medium' ? 3 : 4;
  assert.equal(cards.length, mode === 'medium' ? 8 : 12);
  assert.equal(new Set(cards.map(r => r.id)).size, cards.length);
  for (const qty of Object.values(board.pantry)) assert.ok(Number.isInteger(qty) && qty > 0);
  for (const card of cards) {
    const count = Object.keys(card.ingredients).length;
    assert.ok(count >= (mode === 'medium' ? 3 : 4) && count <= (mode === 'medium' ? 4 : 6));
    for (const [id, qty] of Object.entries(card.ingredients)) assert.ok(Number.isInteger(qty) && qty > 0 && board.pantry[id] >= qty);
  }
  const answers = [];
  function walk(start, chosen, used) {
    if (chosen.length === picks) {
      if (Object.keys(board.pantry).every(id => used[id] === board.pantry[id]) && Object.keys(used).every(id => id in board.pantry)) answers.push([...chosen]);
      return;
    }
    for (let i = start; i <= cards.length - (picks - chosen.length); i++) {
      const next = { ...used }; for (const [id, q] of Object.entries(cards[i].ingredients)) next[id] = (next[id] || 0) + q;
      walk(i + 1, [...chosen, cards[i].id], next);
    }
  }
  walk(0, [], {}); assert.equal(answers.length, 1, `Unique solution: ${board.id || mode}`);
  if (board.solution) assert.deepEqual(answers[0].sort(), [...board.solution].sort());
  return answers[0];
}
export function verifyBaseline() {
  const start = performance.now(), result = { baseline: 'Quality V3', boards: 0, files: {} };
  for (const mode of ['medium', 'hard']) {
    const filename = new URL(`../proposals/content-expansion/quality-v3/${mode}-100.json`, import.meta.url), bytes = fs.readFileSync(filename), boards = JSON.parse(bytes);
    assert.equal(boards.length, 100);
    for (const board of boards) { independentlyValidate(board, mode); result.boards++; }
    result.files[mode] = crypto.createHash('sha256').update(bytes).digest('hex');
  }
  return { ...result, unique: result.boards, milliseconds: Math.round(performance.now() - start) };
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) console.log(JSON.stringify(verifyBaseline(), null, 2));
