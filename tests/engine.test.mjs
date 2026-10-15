import test from 'node:test'; import assert from 'node:assert/strict';
import { consumption, inventoryState, validateSelection, combinations, enumerateSolutions } from '../src/game/engine.js';
const recipes=[
  {id:'a',ingredients:{rice:2,onion:1,egg:1,tomato:1}},
  {id:'b',ingredients:{rice:1,onion:1,cheese:2,garlic:1}},
  {id:'c',ingredients:{tomato:1,egg:1,cheese:1,garlic:1}},
  {id:'d',ingredients:{rice:3,onion:1,cheese:1,x:1}},
  {id:'e',ingredients:{rice:1,onion:1,egg:1,x:1}},
  {id:'f',ingredients:{cheese:1,garlic:1,tomato:1,x:1}},
  {id:'g',ingredients:{rice:1,onion:1,cheese:1,x:1}},
  {id:'h',ingredients:{egg:1,garlic:1,cheese:1,x:1}}
];
const puzzle={mode:'medium',pantry:{rice:3,onion:2,egg:2,tomato:2,cheese:3,garlic:2},recipes};
test('consumption sums shared ingredients and quantities > 1',()=>assert.deepEqual(consumption(recipes,['a','b','c']),puzzle.pantry));
test('inventory exposes unused, partial, complete and overused states',()=>{const s=inventoryState({a:2,b:2,c:1,d:1},{b:1,c:1,d:2});assert.equal(s.a.status,'unused');assert.equal(s.b.status,'partial');assert.equal(s.c.status,'complete');assert.equal(s.d.status,'overused');assert.equal(s.d.remaining,-1)});
test('validation requires distinct known recipes, exact count and zero leftovers',()=>{assert.equal(validateSelection(puzzle,['a','b','c']).win,true);assert.equal(validateSelection(puzzle,['a','b']).win,false);assert.equal(validateSelection(puzzle,['a','a','b']).win,false);assert.equal(validateSelection(puzzle,['a','b','unknown']).win,false)});
test('combination counts match mode search spaces',()=>{assert.equal(combinations(Array(8).fill(0),3).length,56);assert.equal(combinations(Array(12).fill(0),4).length,495)});
test('solution enumerator finds the intended unordered menu',()=>assert.deepEqual(enumerateSolutions(puzzle),[['a','b','c']]));
