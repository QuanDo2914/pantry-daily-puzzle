import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {INGREDIENT_ART,RECIPE_PRESENTATIONS,ingredientArt,recipeArt,recipeArtKind} from '../src/visuals/clearline.js';
import {INGREDIENTS,RECIPES} from '../src/data/catalog.js';

const manifest=JSON.parse(fs.readFileSync(new URL('../docs/clearline/asset-manifest.json',import.meta.url)));
const emoji=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const activeContent=/<script\b|<foreignObject\b|<image\b|\bon\w+\s*=|(?:href|src)\s*=|url\s*\(/i;

test('all 125 custom ingredient assets resolve without emoji or external content',()=>{
 assert.equal(manifest.ingredients.length,125);
 assert.equal(new Set(manifest.ingredients.map(row=>row.id)).size,125);
 assert.deepEqual(Object.keys(INGREDIENT_ART).sort(),manifest.ingredients.map(row=>row.id).sort());
 assert.equal(new Set(Object.values(INGREDIENT_ART)).size,125);
 for(const row of manifest.ingredients){const svg=ingredientArt(row.id,row.name);assert.match(svg,/<svg[^>]+viewBox=/);assert.match(svg,/<(?:path|circle|ellipse)/);assert.doesNotMatch(svg,emoji);assert.doesNotMatch(svg,activeContent)}
 assert.throws(()=>ingredientArt('unknown_ingredient'),/missing/i);
});

test('225 prepared dishes have explicit, distinct Medium and Hard illustrations',()=>{
 assert.equal(manifest.recipes.length,225);
 assert.equal(new Set(manifest.recipes.map(row=>row.id)).size,225);
 assert.deepEqual(Object.keys(RECIPE_PRESENTATIONS).sort(),manifest.recipes.map(row=>row.id).sort());
 for(const mode of ['medium','hard']){
  const drawings=new Set();
  for(const recipe of manifest.recipes){
   const ids=recipe.visualComponents[mode];
   assert.ok(ids.every(id=>INGREDIENT_ART[id]),`${recipe.id}: missing visual component`);
   const svg=recipeArt({...recipe,ingredients:Object.fromEntries(ids.map(id=>[id,1]))});
   assert.match(svg,/prepared dish illustration/);assert.match(svg,/class="clearline-art dish-art dish-/);
   assert.doesNotMatch(svg,emoji);assert.doesNotMatch(svg,activeContent);
   drawings.add(svg.replace(/aria-label="[^"]+"/,''));
  }
  assert.equal(drawings.size,225,`${mode} has duplicate prepared-dish drawings`);
 }
});

test('corrected prepared dishes retain appropriate serving silhouettes',()=>{
 const expected={ham_and_cheese:'sandwich',meatball_sub:'sub',burrito_bowl:'burrito_bowl',beef_burrito:'burrito',bean_burrito:'burrito',breakfast_burrito:'burrito',chicken_wrap:'wrap',veggie_wrap:'wrap',cheese_quesadilla:'quesadilla',broccoli_cheddar_soup:'soup',broccoli_cheese_bake:'bake'};
 for(const [id,kind] of Object.entries(expected))assert.equal(recipeArtKind(manifest.recipes.find(row=>row.id===id)),kind,id);
});

test('inactive Clearline assets support existing production identities',()=>{
 for(const id of Object.keys(INGREDIENTS))assert.doesNotThrow(()=>ingredientArt(id));
 for(const recipe of RECIPES)assert.doesNotThrow(()=>recipeArt(recipe));
});
