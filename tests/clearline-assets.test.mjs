import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {INGREDIENTS,PROPOSED_ADDITIONS} from '../proposals/content-expansion/data.mjs';
import {INGREDIENT_ART,LEGACY_INGREDIENT_ALIASES,ingredientArt,recipeArt,recipeArtKind} from '../src/visuals/clearline.js';
import {INGREDIENTS as LEGACY_INGREDIENTS,RECIPES as LEGACY_RECIPES} from '../src/data/catalog.js';
import {enumerateSolutions} from '../src/game/engine.js';

const catalog=JSON.parse(fs.readFileSync(new URL('../proposals/content-expansion/quality-v3/proposed-recipe-catalog.json',import.meta.url)));
const ids=[...INGREDIENTS,...PROPOSED_ADDITIONS].map(x=>x.id);
const emoji=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

test('all 90 catalog ingredients have explicit, custom, non-emoji SVG art',()=>{
 assert.equal(ids.length,90);assert.equal(new Set(ids).size,90);
 assert.deepEqual(Object.keys(INGREDIENT_ART).sort(),ids.sort());
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
 for(const [id,kind] of [['baked_salmon','plate'],['loaded_baked_potato','potato'],['pancakes','pancake'],['scrambled_eggs','scramble'],['avocado_toast','toast'],['nachos','nachos']])assert.equal(recipeArtKind(catalog.recipes.find(x=>x.id===id)),kind);
});

test('each V3 recipe has a visually distinct prepared-dish drawing',()=>{
 for(const mode of ['medium','hard']){
  const drawings=catalog.recipes.map(recipe=>recipeArt({...recipe,ingredients:recipe.variants[mode]}).replace(/aria-label="[^"]+"/,''));
  assert.equal(new Set(drawings).size,150,`${mode} has duplicate dish art`);
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
