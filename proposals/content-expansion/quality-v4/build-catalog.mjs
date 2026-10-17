import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const v3 = JSON.parse(fs.readFileSync(path.join(root, '../quality-v3/proposed-recipe-catalog.json')));
const edits = {
  spinach_flatbread: { tomato: 1 },
  tomato_garlic_flatbread: { basil: 1 },
  mushroom_pizza: { garlic: 1 },
  breakfast_pizza: { spinach: 1 },
  lemon_salmon: { garlic: 1, butter: 1 },
  salmon_rice_bowl: { soy_sauce: 1 },
  garlic_fish_pasta: { lemon: 1 },
  shrimp_tacos: { avocado: 1 },
  pad_thai: { lime: 1, soy_sauce: 1 },
  sesame_noodles: { ginger: 1 },
  chicken_ramen: { mushroom: 1 },
  beef_lo_mein: { soy_sauce: 1 },
  vegetable_lo_mein: { soy_sauce: 1 },
  minestrone: { celery: 1, zucchini: 1 },
  chicken_noodle_soup: { onion: 1 },
  lentil_soup: { garlic: 1 },
  pancakes: { butter: 1 },
  french_toast: { butter: 1 },
  oatmeal_bowl: { blueberry: 1 },
  breakfast_burrito: { sausage: 1 },
  chicken_shawarma_bowl: { cucumber: 1, yogurt: 1, cumin: 1, lettuce: null },
  greek_chicken_bowl: { cucumber: 1, tomato: 1, lemon: 1, lettuce: null },
  chicken_casserole: { cream: 1 },
  tuna_casserole: { breadcrumbs: 1 },
  tomato_basil_pasta: { garlic: 1 }
};
const byId = new Map(v3.recipes.map(recipe => [recipe.id, recipe]));
if (Object.keys(edits).length !== 25) throw new Error('Expected exactly 25 adjustments');
for (const id of Object.keys(edits)) if (!byId.has(id)) throw new Error(`Unknown recipe: ${id}`);
const changes = [];
const recipes = v3.recipes.map(recipe => {
  if (!edits[recipe.id]) return recipe;
  const before = recipe.variants.hard;
  const hard = { ...before };
  for (const [ingredient, quantity] of Object.entries(edits[recipe.id])) {
    if (quantity === null) delete hard[ingredient]; else hard[ingredient] = quantity;
  }
  changes.push({ id: recipe.id, name: recipe.name, family: recipe.family, before, after: hard, delta: edits[recipe.id] });
  return { ...recipe, variants: { ...recipe.variants, hard } };
});
const counts = { 4: 0, 5: 0, 6: 0 };
for (const recipe of recipes) {
  const mediumCount = Object.keys(recipe.variants.medium).length;
  const hardCount = Object.keys(recipe.variants.hard).length;
  if (mediumCount < 3 || mediumCount > 4 || hardCount < 4 || hardCount > 6) throw new Error(`Ingredient count invalid: ${recipe.id}`);
  for (const quantity of Object.values(recipe.variants.hard)) if (!Number.isInteger(quantity) || quantity < 1 || quantity > 4) throw new Error(`Quantity invalid: ${recipe.id}`);
  counts[hardCount]++;
}
if (JSON.stringify(counts) !== JSON.stringify({ 4: 125, 5: 20, 6: 5 })) throw new Error(`Unexpected Hard distribution: ${JSON.stringify(counts)}`);
fs.writeFileSync(path.join(root, 'candidate-recipe-catalog.json'), JSON.stringify({ status: 'experimental_quality_v4', source: '../quality-v3/proposed-recipe-catalog.json', recipes }, null, 2));
fs.writeFileSync(path.join(root, 'recipe-changes.json'), JSON.stringify({ count: changes.length, hardIngredientCounts: counts, changes }, null, 2));
console.log(`V4 catalog: ${recipes.length} recipes, ${changes.length} changes, Hard counts ${JSON.stringify(counts)}`);
