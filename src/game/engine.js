export const MODE_RULES = Object.freeze({
  medium: { cards: 8, picks: 3 },
  hard: { cards: 12, picks: 4 }
});

export function consumption(recipes, selectedIds) {
  const selected = new Set(selectedIds);
  const used = {};
  for (const recipe of recipes) if (selected.has(recipe.id)) {
    for (const [id, qty] of Object.entries(recipe.ingredients)) used[id] = (used[id] || 0) + qty;
  }
  return used;
}

export function inventoryState(pantry, used) {
  return Object.fromEntries(Object.entries(pantry).map(([id, available]) => {
    const consumed = used[id] || 0;
    const remaining = available - consumed;
    const status = consumed === 0 ? 'unused' : remaining < 0 ? 'overused' : remaining === 0 ? 'complete' : 'partial';
    return [id, { available, consumed, remaining, status }];
  }));
}

export function validateSelection(puzzle, selectedIds) {
  const rules = MODE_RULES[puzzle.mode];
  const unique = [...new Set(selectedIds)];
  const known = new Set(puzzle.recipes.map(r => r.id));
  const used = consumption(puzzle.recipes, unique);
  const state = inventoryState(puzzle.pantry, used);
  const exactCount = unique.length === rules.picks && unique.length === selectedIds.length;
  const noUnknown = unique.every(id => known.has(id));
  const exactInventory = Object.values(state).every(x => x.remaining === 0) &&
    Object.keys(used).every(id => id in puzzle.pantry);
  return { win: exactCount && noUnknown && exactInventory, exactCount, noUnknown, exactInventory, used, state };
}

export function combinations(items, size) {
  const out = [];
  const walk = (start, chosen) => {
    if (chosen.length === size) return void out.push(chosen.slice());
    for (let i = start; i <= items.length - (size - chosen.length); i++) {
      chosen.push(items[i]); walk(i + 1, chosen); chosen.pop();
    }
  };
  walk(0, []);
  return out;
}

export function enumerateSolutions(puzzle) {
  return combinations(puzzle.recipes.map(r => r.id), MODE_RULES[puzzle.mode].picks)
    .filter(ids => validateSelection(puzzle, ids).win);
}

export function scoreCombination(puzzle, ids) {
  const { state } = validateSelection(puzzle, ids);
  const entries = Object.values(state);
  const exact = entries.filter(x => x.remaining === 0).length;
  const distance = entries.reduce((n, x) => n + Math.abs(x.remaining), 0);
  return { exact, distance };
}

export const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
