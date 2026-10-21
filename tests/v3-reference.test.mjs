import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {enumerateSolutions} from '../src/game/engine.js';

const root=new URL('../proposals/content-expansion/quality-v3/',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name,root)));
const recipes=read('proposed-recipe-catalog.json').recipes;
const byId=new Map(recipes.map(recipe=>[recipe.id,recipe]));

test('frozen V3 reference retains 100 canonical uniquely solved boards per mode',()=>{
 assert.equal(recipes.length,150);assert.equal(byId.size,150);
 for(const mode of ['medium','hard']){
  const boards=read(`${mode}-100.json`),solutions=new Set(),cardSets=new Set();
  assert.equal(boards.length,100);
  for(const board of boards){
   const picks=mode==='medium'?3:4,cardCount=mode==='medium'?8:12;
   assert.equal(board.cards.length,cardCount);assert.equal(new Set(board.cards.map(card=>card.id)).size,cardCount);
   assert.equal(board.solution.length,picks);assert.equal(new Set(board.solution).size,picks);
   const pantryTypes=Object.keys(board.pantry).length;
   assert.ok(mode==='medium'?pantryTypes>=8&&pantryTypes<=12:pantryTypes>=12&&pantryTypes<=16);
   const families=new Map();
   for(const card of board.cards){
    const recipe=byId.get(card.id);assert.ok(recipe);assert.equal(card.name,recipe.name);assert.equal(card.family,recipe.family);
    assert.deepEqual(card.ingredients,recipe.variants[mode]);
    const count=Object.keys(card.ingredients).length;assert.ok(mode==='medium'?count>=3&&count<=4:count>=4&&count<=6);
    assert.ok(Object.entries(card.ingredients).every(([id,qty])=>Number.isInteger(qty)&&qty>=1&&qty<=4&&board.pantry[id]>=qty));
    families.set(card.family,(families.get(card.family)||0)+1);
   }
   assert.ok(families.size>=(mode==='medium'?6:7));assert.ok(Math.max(...families.values())<=2);
   const exact=enumerateSolutions({...board,recipes:board.cards});assert.equal(exact.length,1,board.id);
   assert.deepEqual([...exact[0]].sort(),[...board.solution].sort(),board.id);
   solutions.add([...board.solution].sort().join('|'));cardSets.add(board.cards.map(card=>card.id).sort().join('|'));
  }
  assert.equal(solutions.size,100);
  // The approved Medium baseline has three reused card sets with different
  // pantry inventories and solutions. Preserve it; do not rewrite content here.
  assert.equal(cardSets.size,mode==='medium'?97:100);
 }
 const audit=read('independent-verification.json');assert.equal(audit.summary.passed,200);assert.equal(audit.summary.failed,0);
});

test('artwork and V3 source snapshots match the preserved reviewed commit',()=>{
 const provenance=JSON.parse(fs.readFileSync(new URL('../docs/main-review/provenance.json',import.meta.url)));
 for(const [name,expected] of Object.entries(provenance.files)){
  const bytes=fs.readFileSync(new URL(`../${name}`,import.meta.url));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),expected,name);
 }
});
