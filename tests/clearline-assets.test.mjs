import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {INGREDIENTS,PROPOSED_ADDITIONS} from '../proposals/content-expansion/data.mjs';
import {INGREDIENT_ART,LEGACY_INGREDIENT_ALIASES,RECIPE_PRESENTATIONS,ingredientArt,recipeArt,recipeArtKind} from '../src/visuals/clearline.js';
import {ingredientArt as oldIngredientArt,recipeArt as oldRecipeArt} from '../src/visuals/clearline-v1.js';
import {INGREDIENTS as LEGACY_INGREDIENTS,RECIPES as LEGACY_RECIPES} from '../src/data/catalog.js';
import {enumerateSolutions} from '../src/game/engine.js';

const catalog=JSON.parse(fs.readFileSync(new URL('../proposals/content-expansion/quality-v3/proposed-recipe-catalog.json',import.meta.url)));
const expandedCatalog=JSON.parse(fs.readFileSync(new URL('../proposals/content-expansion/clearline-expansion/candidate-recipe-catalog.json',import.meta.url)));
const expandedIngredients=JSON.parse(fs.readFileSync(new URL('../proposals/content-expansion/clearline-expansion/ingredient-catalog.json',import.meta.url))).ingredients;
const ids=[...INGREDIENTS,...PROPOSED_ADDITIONS].map(x=>x.id);
const emoji=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

test('all 90 catalog ingredients have explicit, custom, non-emoji SVG art',()=>{
 assert.equal(ids.length,90);assert.equal(new Set(ids).size,90);
 assert.deepEqual(ids.sort(),Object.keys(INGREDIENT_ART).filter(id=>ids.includes(id)).sort());
 const bodies=new Set();
 for(const x of [...INGREDIENTS,...PROPOSED_ADDITIONS]){
  const svg=ingredientArt(x.id,x.name);
  assert.match(svg,/<svg[^>]+viewBox=/);
  assert.match(svg,/<(path|circle|ellipse)/);
  assert.doesNotMatch(svg,emoji);
  assert.ok(svg.length>220,`${x.id} art is unexpectedly empty`);
  bodies.add(INGREDIENT_ART[x.id]);
 }
 assert.equal(bodies.size,90,'each ingredient must have its own drawing');
 assert.match(ingredientArt('broccoli','Broccoli',true),/viewBox="30 19 60 60"/);
 assert.throws(()=>ingredientArt('not_in_catalog'),/missing/);
});

test('all 150 V3 recipes render as prepared dishes in Medium and Hard',()=>{
 assert.equal(catalog.recipes.length,150);
 assert.equal(new Set(catalog.recipes.map(x=>x.id)).size,150);
 const rendered=new Set();
 for(const recipe of catalog.recipes)for(const mode of ['medium','hard']){
  const ingredients=recipe.variants[mode];
  assert.ok(Object.keys(ingredients).length>=3);
  for(const id of Object.keys(ingredients))assert.ok(INGREDIENT_ART[id],`${recipe.id} uses an ingredient without art: ${id}`);
  const svg=recipeArt({...recipe,ingredients});
  assert.match(svg,/<svg[^>]+dish-/);
  assert.match(svg,/prepared dish illustration/);
  assert.doesNotMatch(svg,emoji);
  assert.ok(svg.length>400,`${recipe.id} ${mode} dish is unexpectedly empty`);
  rendered.add(`${recipe.id}:${mode}`);
 }
 assert.equal(rendered.size,300);
 assert.notEqual(recipeArtKind(catalog.recipes.find(x=>x.id==='broccoli_cheddar_soup')),recipeArtKind(catalog.recipes.find(x=>x.id==='broccoli_cheese_bake')));
 assert.notEqual(recipeArtKind(catalog.recipes.find(x=>x.id==='chicken_burger')),recipeArtKind(catalog.recipes.find(x=>x.id==='chicken_shawarma_bowl')));
 for(const [id,kind] of [['baked_salmon','fish'],['loaded_baked_potato','potato'],['pancakes','pancake'],['scrambled_eggs','scramble'],['avocado_toast','toast'],['nachos','nachos'],['ham_and_cheese','sandwich'],['burrito_bowl','burrito_bowl'],['meatball_sub','sub']])assert.equal(recipeArtKind(catalog.recipes.find(x=>x.id===id)),kind);
});

test('all approved recipes have intentional serving shapes; previous art stays available',()=>{
 assert.deepEqual(Object.keys(RECIPE_PRESENTATIONS).sort(),expandedCatalog.recipes.map(x=>x.id).sort());
 for(const recipe of catalog.recipes){
  const revised=recipeArt({...recipe,ingredients:recipe.variants.hard});
  const original=oldRecipeArt({...recipe,ingredients:recipe.variants.hard});
  assert.match(revised,/class="clearline-art dish-art dish-/);
  assert.match(original,/<svg/);
  assert.doesNotMatch(revised,emoji);
 }
 for(const id of ['rice','quinoa','couscous','milk','cream','cheese','mozzarella','parmesan','black_beans','kidney_beans','chickpeas','lentils']){
  assert.notEqual(ingredientArt(id),oldIngredientArt(id));
 }
});

test('each V3 recipe has a visually distinct prepared-dish drawing',()=>{
 for(const mode of ['medium','hard']){
  const drawings=catalog.recipes.map(recipe=>recipeArt({...recipe,ingredients:recipe.variants[mode]}).replace(/aria-label="[^"]+"/,''));
  assert.equal(new Set(drawings).size,150,`${mode} has duplicate dish art`);
 }
});

test('rolled burritos, open wraps, and folded quesadillas use different silhouettes',()=>{
 for(const id of ['beef_burrito','bean_burrito','breakfast_burrito'])assert.equal(recipeArtKind(catalog.recipes.find(x=>x.id===id)),'burrito');
 for(const id of ['chicken_wrap','veggie_wrap'])assert.equal(recipeArtKind(catalog.recipes.find(x=>x.id===id)),'wrap');
 for(const id of ['chicken_quesadilla','cheese_quesadilla','mushroom_quesadilla'])assert.equal(recipeArtKind(catalog.recipes.find(x=>x.id===id)),'quesadilla');
 const drawings=['beef_burrito','bean_burrito','chicken_wrap','veggie_wrap','chicken_quesadilla'].map(id=>{
  const recipe=catalog.recipes.find(x=>x.id===id);
  return recipeArt({...recipe,ingredients:recipe.variants.hard});
 });
 assert.equal(new Set(drawings).size,drawings.length);
});

test('V3 Hard appendix has 19 visual changes; two ingredient swaps currently render the same',()=>{
 const changed=catalog.recipes.filter(recipe=>recipeArt({...recipe,ingredients:recipe.variants.medium})!==recipeArt({...recipe,ingredients:recipe.variants.hard}));
 assert.equal(changed.length,19);
 for(const id of ['cheesy_bean_bake','cheese_flatbread']){
  const recipe=catalog.recipes.find(x=>x.id===id);
  assert.equal(recipeArt({...recipe,ingredients:recipe.variants.medium}),recipeArt({...recipe,ingredients:recipe.variants.hard}));
 }
});

test('all 125 experimental ingredients and 225 recipes have explicit, distinct SVG artwork',()=>{
 assert.equal(expandedIngredients.length,125);assert.equal(expandedCatalog.recipes.length,225);
 assert.equal(new Set(expandedIngredients.map(x=>x.id)).size,125);
 assert.equal(new Set(expandedCatalog.recipes.map(x=>x.id)).size,225);
 assert.deepEqual(expandedCatalog.recipes.slice(0,150),catalog.recipes,'V3 recipe definitions must remain unchanged');
 assert.deepEqual(Object.keys(INGREDIENT_ART).sort(),expandedIngredients.map(x=>x.id).sort());
 assert.equal(new Set(expandedIngredients.map(x=>INGREDIENT_ART[x.id])).size,125);
 for(const ingredient of expandedIngredients){const svg=ingredientArt(ingredient.id,ingredient.name);assert.match(svg,/<svg[^>]+viewBox=/);assert.doesNotMatch(svg,emoji)}
 for(const mode of ['medium','hard']){
  const drawings=new Set();
  for(const recipe of expandedCatalog.recipes){
   const scored=recipe.variants[mode],count=Object.keys(scored).length;
   assert.ok(mode==='medium'?count>=3&&count<=4:count>=4&&count<=6,`${recipe.id} ${mode} ingredient count`);
   assert.ok(Object.entries(scored).every(([id,qty])=>INGREDIENT_ART[id]&&Number.isInteger(qty)&&qty>=1&&qty<=4));
   assert.ok(RECIPE_PRESENTATIONS[recipe.id],`${recipe.id} has no explicit serving shape`);
   const svg=recipeArt({...recipe,ingredients:scored});assert.doesNotMatch(svg,emoji);
   drawings.add(svg.replace(/aria-label="[^"]+"/,''));
  }
  assert.equal(drawings.size,225,`${mode} has duplicate prepared-dish art`);
 }
});

test('legacy daily puzzles keep their recipe data and gain Clearline art',()=>{
 for(const id of Object.keys(LEGACY_INGREDIENTS))assert.doesNotThrow(()=>ingredientArt(id));
 for(const [id,canonical] of Object.entries(LEGACY_INGREDIENT_ALIASES))assert.ok(INGREDIENT_ART[canonical],`${id} alias is broken`);
 for(const recipe of LEGACY_RECIPES)assert.doesNotThrow(()=>recipeArt(recipe));
});

test('all V3 preview boards retain their single exact-quantity solution',()=>{
 const recipeIds=new Set(catalog.recipes.map(x=>x.id));
 for(const mode of ['medium','hard']){
  const boards=JSON.parse(fs.readFileSync(new URL(`../proposals/content-expansion/quality-v3/${mode}-100.json`,import.meta.url)));
  assert.equal(boards.length,100);
  for(const board of boards){
   for(const id of Object.keys(board.pantry))assert.ok(INGREDIENT_ART[id],`${mode} board ${board.day} missing ${id}`);
   for(const card of board.cards)assert.ok(recipeIds.has(card.id),`${mode} board ${board.day} unknown ${card.id}`);
   const solutions=enumerateSolutions({...board,recipes:board.cards});
   assert.equal(solutions.length,1,`${mode} board ${board.day} has ${solutions.length} solutions`);
   assert.deepEqual([...solutions[0]].sort(),[...board.solution].sort());
  }
 }
});
