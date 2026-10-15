import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { RECIPE_LIBRARY as RECIPES } from '../src/data/catalog.js';
import { MODE_RULES, enumerateSolutions, combinations, scoreCombination } from '../src/game/engine.js';

const outRoot = path.resolve('public/puzzles');
const reportDir = path.resolve('reports');
fs.rmSync(outRoot, { recursive:true, force:true });
fs.mkdirSync(outRoot, { recursive:true });
fs.mkdirSync(reportDir, { recursive:true });

function rng(seed) { let x=seed>>>0; return () => ((x = Math.imul(x ^ x>>>15, 1|x), x ^= x + Math.imul(x ^ x>>>7, 61|x), ((x ^ x>>>14)>>>0)/4294967296)); }
const sample = (a,n,r) => [...a].sort(()=>r()-.5).slice(0,n);
const pantryFor = recipes => recipes.reduce((p,r) => { for (const [k,v] of Object.entries(r.ingredients)) p[k]=(p[k]||0)+v; return p; },{});
const feasible = (r,p) => Object.entries(r.ingredients).every(([k,v]) => p[k] >= v);
// Rename-invariant Weisfeiler-Lehman fingerprint of the weighted bipartite
// ingredient/recipe graph. Correct-menu membership is part of the structure.
const structuralSignature = (p, solution) => {
  const ingredientIds=Object.keys(p.pantry), recipeIds=p.recipes.map(r=>r.id), inSolution=new Set(solution);
  let labels=new Map();
  for(const id of ingredientIds) labels.set(`i:${id}`,`I:${p.pantry[id]}`);
  for(const r of p.recipes) labels.set(`r:${r.id}`,`R:${inSolution.has(r.id)?1:0}:${Object.keys(r.ingredients).length}:${Object.values(r.ingredients).sort().join('')}`);
  const digest=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
  for(let round=0;round<6;round++){
    const next=new Map();
    for(const id of ingredientIds){const neighbors=p.recipes.filter(r=>r.ingredients[id]).map(r=>`${r.ingredients[id]}:${labels.get(`r:${r.id}`)}`).sort();next.set(`i:${id}`,digest(`${labels.get(`i:${id}`)}|${neighbors.join(',')}`))}
    for(const r of p.recipes){const neighbors=Object.entries(r.ingredients).map(([id,q])=>`${q}:${labels.get(`i:${id}`)}`).sort();next.set(`r:${r.id}`,digest(`${labels.get(`r:${r.id}`)}|${neighbors.join(',')}`))}
    labels=next;
  }
  return digest(`${p.mode}|${[...labels.values()].sort().join('|')}`);
};

function hintsFor(puzzle, solution) {
  const chosen = puzzle.recipes.filter(r=>solution.includes(r.id));
  const shared = Object.entries(puzzle.pantry).sort((a,b)=>b[1]-a[1])[0][0];
  const decoy = puzzle.recipes.find(r=>!solution.includes(r.id) && r.ingredients[shared]);
  return [
    `Track ${shared} carefully: several dishes use it, but its full quantity must be balanced with every other ingredient.`,
    decoy ? `${decoy.name} looks useful, but any complete menu containing it creates a conflict elsewhere in the pantry.` : `Compare recipes that share ${shared}; matching one ingredient is not enough.`,
    `${chosen[0].name} belongs in the completed menu.`
  ];
}

function makePuzzle(mode, day, usedSignatures) {
  const rules=MODE_RULES[mode];
  for (let attempt=0; attempt<50000; attempt++) {
    const random=rng(0x9e3779b9 ^ day*2654435761 ^ attempt*1013904223 ^ (mode==='hard'?0xabcdef:0x123456));
    const answer=sample(RECIPES,rules.picks,random);
    const pantry=pantryFor(answer);
    const ingredientCount=Object.keys(pantry).length;
    if (ingredientCount < (mode==='hard'?9:7) || ingredientCount > (mode==='hard'?13:11)) continue;
    const pool=RECIPES.filter(r=>!answer.includes(r)&&feasible(r,pantry));
    if(pool.length<rules.cards-rules.picks) continue;
    // Favor category and ingredient overlap with the answer; random noise keeps days varied.
    const scored=pool.map(r=>({r,s:Object.keys(r.ingredients).filter(k=>k in pantry).length + random()})).sort((a,b)=>b.s-a.s);
    const decoys=sample(scored.slice(0,Math.min(scored.length,18)).map(x=>x.r),rules.cards-rules.picks,random);
    const recipes=sample([...answer,...decoys],rules.cards,random).map(r=>structuredClone(r));
    const puzzle={id:`pantry-${String(day).padStart(3,'0')}-${mode}`,day,mode,pantry,recipes};
    const solutions=enumerateSolutions(puzzle);
    if(solutions.length!==1) continue;
    const all=combinations(recipes.map(r=>r.id),rules.picks);
    const near=all.filter(ids=>!solutions.some(s=>s.join('|')===ids.join('|'))).map(ids=>scoreCombination(puzzle,ids))
      .filter(s=>s.distance<=4 || s.exact>=ingredientCount-2).length;
    const overlap=recipes.reduce((n,r)=>n+Object.keys(r.ingredients).length,0)/(ingredientCount*recipes.length);
    if(mode==='hard' && near<3) continue;
    const solution=solutions[0];
    const sig=structuralSignature(puzzle,solution);
    if(usedSignatures.has(sig)) continue;
    usedSignatures.add(sig);
    const metrics={combinations:all.length,nearMisses:near,overlapDensity:+overlap.toFixed(3),ingredientTypes:ingredientCount,
      rating:mode==='hard'?(near>=10?'expert':near>=6?'hard':'challenging'):(near>=5?'tricky':'balanced')};
    puzzle.hints=hintsFor(puzzle,solution);
    puzzle.difficulty=metrics.rating;
    puzzle.contentVersion=1;
    return {public:puzzle,private:{id:puzzle.id,solution,signature:sig,metrics}};
  }
  throw new Error(`Could not generate ${mode} day ${day}`);
}

const usedSignatures=new Set();
const report=[];
for (const mode of ['medium','hard']) {
  fs.mkdirSync(path.join(outRoot,mode),{recursive:true});
  for(let day=1;day<=100;day++) {
    const made=makePuzzle(mode,day,usedSignatures);
    fs.writeFileSync(path.join(outRoot,mode,`${day}.json`),JSON.stringify(made.public));
    report.push(made.private);
  }
}
fs.writeFileSync(path.join(reportDir,'puzzle-validation.json'),JSON.stringify({generatedAt:new Date().toISOString(),count:report.length,puzzles:report},null,2));
const byMode = mode => report.filter(x=>x.id.endsWith(mode));
const lines=['# Pantry puzzle validation','',`Generated: ${report.length} puzzles`,`Unique structural signatures: ${usedSignatures.size}`,''];
for(const mode of ['medium','hard']) { const rows=byMode(mode); const avg=rows.reduce((n,x)=>n+x.metrics.nearMisses,0)/rows.length; const ratings=Object.groupBy(rows,x=>x.metrics.rating); lines.push(`## ${mode[0].toUpperCase()+mode.slice(1)}`,`- Puzzles: ${rows.length}`,`- Unique solutions: ${rows.length}`,`- Average near misses: ${avg.toFixed(1)}`,`- Difficulty distribution: ${Object.entries(ratings).map(([k,v])=>`${k} ${v.length}`).join(', ')}`,''); }
fs.writeFileSync(path.join(reportDir,'puzzle-validation.md'),lines.join('\n'));
console.log(`Generated ${report.length} uniquely solvable puzzles (${usedSignatures.size} unique structures).`);
