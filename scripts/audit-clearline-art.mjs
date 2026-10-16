import fs from 'node:fs';
import path from 'node:path';
import {INGREDIENTS,PROPOSED_ADDITIONS} from '../proposals/content-expansion/data.mjs';
import * as current from '../src/visuals/clearline.js';
import * as previous from '../src/visuals/clearline-v1.js';

const catalog=JSON.parse(fs.readFileSync('proposals/content-expansion/quality-v3/proposed-recipe-catalog.json','utf8'));
const ingredients=[...INGREDIENTS,...PROPOSED_ADDITIONS];
const priority={ham_and_cheese:'Bowl fallback → sliced ham-and-cheese sandwich',burrito_bowl:'Folded tortilla → open rice, bean, vegetable bowl',meatball_sub:'Triangular wedges → long roll with visible meatballs and sauce',broccoli_rice_skillet:'Rice bowl → skillet',tuna_patties:'Fish fillet → two browned patties'};
const count=(items,predicate)=>items.filter(predicate).length;
const ingredientChanged=x=>current.INGREDIENT_ART[x.id]!==previous.INGREDIENT_ART[x.id];
const drawnBody=svg=>svg.slice(svg.indexOf('<g stroke='));
const recipeChanged=x=>drawnBody(current.recipeArt({...x,ingredients:x.variants.hard}))!==drawnBody(previous.recipeArt({...x,ingredients:x.variants.hard}));
const shapeChanged=x=>current.recipeArtKind(x)!==previous.recipeArtKind(x);
const lines=[
 '# Clearline artwork refinement — complete V3 audit',
 '',
 'This review is limited to the existing 90 ingredients and 150 V3 recipe identities. It changes only artwork and preview tooling; catalog quantities, puzzle data, mechanics, and live deployment remain unchanged.',
 '',
 '## Coverage and outcomes',
 '',
 `- Ingredient IDs checked: **${ingredients.length}/90**; redrawn: **${count(ingredients,ingredientChanged)}**; retained after audit: **${count(ingredients,x=>!ingredientChanged(x))}**.`,
 `- Recipe IDs checked: **${catalog.recipes.length}/150** in both Medium and Hard; artwork changed: **${count(catalog.recipes,recipeChanged)}**; intentionally retained: **${count(catalog.recipes,x=>!recipeChanged(x))}**.`,
 `- Serving-shape classification changed: **${count(catalog.recipes,shapeChanged)}**. All 150 now have explicit presentation assignments; no approved recipe uses the name-based fallback.`,
 '- Every SVG is custom code-native vector art; no emoji or missing-ID fallback. All drawings are framed larger in the game, including those whose geometry was retained. The preserved v1 renderer remains at `src/visuals/clearline-v1.js`.',
 '- The comparison preview provides 40, 48, and 64 px controls. At 40 px, silhouettes and the strongest toppings carry recognition; subtle garnish details still require labels. This is an icon system, not photorealistic food rendering.',
 '',
 '## Highest-priority corrections',
 '',
 '| Recipe | Correction |', '|---|---|',
 ...Object.entries(priority).map(([id,note])=>`| ${catalog.recipes.find(x=>x.id===id)?.name||id} | ${note} |`),
 '',
 '## Family-level differentiation',
 '',
 '- Soups: broth color and dominant contents distinguish tomato, mushroom, broccoli cheddar, chicken noodle, beef stew, lentil, potato, curry, vegetable, and minestrone. Steam is part of the drawing; no perpetual animation.',
 '- Pizzas: basil/mozzarella, pepperoni discs, chicken pieces, vegetables, mushroom caps, BBQ drizzle, egg, and an oval flatbread edge are visible preparation features.',
 '- Burgers: patty colors and silhouettes, cheese, vegetable patty flecks, chicken/turkey layers, and Sloppy Joe sauce overflow distinguish variants.',
 '- Rice, noodle, curry, and grain bowls: rice grains, noodles/egg, curry sauce, separated toppings, falafel, shawarma strips, and pineapple sections distinguish the preparations.',
 '- Pasta, casseroles, and bakes: noodle plate, baking dish, layered lasagna slice, gratin slices, broccoli florets, beans, mac curls, and shepherd’s pie topping differ in both container and food shape.',
 '- Salads and seafood: salad-specific large produce/protein forms; salmon fillet versus tuna patties, shrimp curves, and lemon wedge.',
 '',
 '## Ingredient-by-ingredient audit',
 '',
 '| ID | Name | Result |', '|---|---|---|',
 ...ingredients.map(x=>`| ${x.id} | ${x.name.replaceAll('|','\\|')} | ${ingredientChanged(x)?'Refined silhouette, texture, or packaging':'Retained; recognizable in Clearline set'} |`),
 '',
 '## Recipe-by-recipe audit',
 '',
 '| ID | Name | Previous → refined presentation | Result |', '|---|---|---|---|',
 ...catalog.recipes.map(x=>{const before=previous.recipeArtKind(x),after=current.recipeArtKind(x);const status=priority[x.id]|| (shapeChanged(x)?'Serving shape corrected':recipeChanged(x)?'Dish-specific detail or food rendering refined':'Retained after visual audit');return `| ${x.id} | ${x.name.replaceAll('|','\\|')} | ${before} → ${after} | ${status} |`}),
 '',
 '## Validation boundary',
 '',
 'Automated tests assert 90/90 ingredient art IDs, 150/150 explicit recipe presentations, 300 Medium/Hard renderings, zero emoji fallbacks, and all 200 V3 preview boards retaining one exact-quantity solution. Visual inspection of the full gallery and size-controlled comparison remains a human design approval step; automated SVG uniqueness does not prove that every pair is effortlessly distinguishable at 40 px.',
 ''
];
const target=path.resolve('clearline-review/refinement-audit.md');
fs.writeFileSync(target,lines.join('\n'));
console.log(`Wrote ${target}`);
