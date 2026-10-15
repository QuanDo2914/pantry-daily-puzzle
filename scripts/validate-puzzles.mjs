import fs from 'node:fs';
import { enumerateSolutions, MODE_RULES } from '../src/game/engine.js';
const ids=new Set(), sigs=new Set(); let count=0;
const report=JSON.parse(fs.readFileSync('reports/puzzle-validation.json','utf8'));
const privateById=new Map(report.puzzles.map(x=>[x.id,x]));
for(const mode of ['medium','hard']) for(let day=1;day<=100;day++) {
  const p=JSON.parse(fs.readFileSync(`public/puzzles/${mode}/${day}.json`,'utf8'));
  const meta=privateById.get(p.id); const rules=MODE_RULES[mode];
  if(!meta||p.mode!==mode||p.day!==day) throw Error(`identity mismatch ${mode}/${day}`);
  if(ids.has(p.id)||sigs.has(meta.signature)) throw Error(`duplicate ${p.id}`); ids.add(p.id); sigs.add(meta.signature);
  if(p.recipes.length!==rules.cards||new Set(p.recipes.map(r=>r.id)).size!==rules.cards) throw Error(`cards ${p.id}`);
  if(Object.values(p.pantry).some(q=>q<1)||p.recipes.some(r=>Object.keys(r.ingredients).length<4||Object.values(r.ingredients).some(q=>q<1))) throw Error(`quantities ${p.id}`);
  const solutions=enumerateSolutions(p); if(solutions.length!==1||solutions[0].length!==rules.picks) throw Error(`solution ${p.id}`);
  if(p.hints.length!==3||!p.hints[2].includes(p.recipes.find(r=>r.id===solutions[0][0]).name)) throw Error(`hints ${p.id}`);
  count++;
}
console.log(`Validated ${count} puzzles: correct modes, card counts, quantities, IDs, structures, hints, and exactly one solution each.`);
